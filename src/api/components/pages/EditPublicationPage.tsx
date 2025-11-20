import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicationForm from "../PublicationForm";
import {
  fetchPublication,
  updatePublication,
  createPublication,
  type PublicationStatus,
} from "../../../api/publications";

export default function EditPublicationPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new" || !id;

  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  const [initial, setInitial] = useState<{
    title: string;
    content: string;
    status: PublicationStatus;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew && id) {
      (async () => {
        setLoading(true);
        try {
          const p = await fetchPublication(id);

          setInitial({
            title: p.title,
            content: p.content,
            status: p.status as PublicationStatus,
          });
        } catch (err: any) {
          setError(err?.response?.data?.error || "Failed to load publication");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setInitial({ title: "", content: "", status: "draft" as PublicationStatus });
    }
  }, [id, isNew]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    status: PublicationStatus;
  }) => {
    setSaving(true);
    setError(null);

    try {
      if (isNew) {
        await createPublication(data);
      } else if (id) {
        await updatePublication(id, data);
      }

      navigate("/publications");
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.join?.(", ") ||
        err?.response?.data?.error ||
        "Save failed";

      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !initial) {
    return <div className="text-center text-gray-600 py-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isNew ? "Create New Publication" : "Edit Publication"}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-md px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-6">
        <PublicationForm
          initialTitle={initial.title}
          initialContent={initial.content}
          initialStatus={initial.status}
          submitting={saving}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
