import { useState} from "react";
import type { FormEvent } from "react";
import type { PublicationStatus } from "../../api/publications";

type Props = {
  initialTitle?: string;
  initialContent?: string;
  initialStatus?: PublicationStatus;
  onSubmit: (data: {
    title: string;
    content: string;
    status: PublicationStatus;
  }) => Promise<void> | void;
  submitting?: boolean;
};

const statusOptions: PublicationStatus[] = ["draft", "published", "archived"];

export default function PublicationForm({
  initialTitle = "",
  initialContent = "",
  initialStatus = "draft",
  onSubmit,
  submitting,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<PublicationStatus>(initialStatus);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content, status });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />

      <select value={status} onChange={(e) => setStatus(e.target.value as PublicationStatus)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
