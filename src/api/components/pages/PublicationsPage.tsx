import { useEffect, useState, ChangeEvent } from "react";
import {
  fetchMyPublications,
  deletePublication,
  bulkDelete,
  type Publication,
  type PublicationStatus,
} from "../../../api/publications";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const statusOptions: (PublicationStatus | "all")[] = [
  "all",
  "draft",
  "published",
  "archived",
];

export default function PublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | "all">(
    "all"
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMyPublications({
        query: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      setItems(data);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to load publications";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;

    setBulkLoading(true);
    try {
      await bulkDelete(selectedIds);
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Bulk delete failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSingleDelete = async (id: number) => {
    if (!window.confirm("Move this publication to trash?")) return;

    try {
      await deletePublication(id);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Publications</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input
          placeholder="Search title..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring focus:ring-blue-200"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring focus:ring-blue-200"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={loadData}
          className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
        >
          Apply
        </button>

        <button
          onClick={() => navigate("/publications/new")}
          className="bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700"
        >
          + Add Publication
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && !items.length && (
        <p className="text-gray-500 mt-6 text-center">No publications found.</p>
      )}

      {items.length > 0 && (
        <div className="mb-3">
          <button
            onClick={handleBulkDelete}
            disabled={!selectedIds.length || bulkLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {bulkLoading
              ? "Deleting..."
              : `Bulk Delete (${selectedIds.length})`}
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-3 px-4"></th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">{p.title}</td>

                  <td className="px-4 py-3 capitalize">{p.status}</td>

                  <td className="px-4 py-3">
                    {new Date(p.created_at).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/publications/${p.id}/edit`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleSingleDelete(p.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
