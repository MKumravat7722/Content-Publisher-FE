import api from "./client";

export type PublicationStatus = "draft" | "published" | "archived";

export type Publication = {
  id: number;
  title: string;
  content: string;
  status: PublicationStatus;
  created_at: string;
};

export async function fetchMyPublications(params?: {
  query?: string;
  status?: string;
}): Promise<Publication[]> {
  const search = params?.query;
  const status = params?.status;

  if (search) {
    const res = await api.get<Publication[]>("/publications/search", {
      params: { query: search },
    });
    return res.data as any;
  }

  if (status) {
    const res = await api.get<Publication[]>("/publications/filter", {
      params: { status },
    });
    return res.data as any;
  }

  const res = await api.get<Publication[]>("/publications");
  return res.data;
}

export async function createPublication(data: {
  title: string;
  content: string;
  status: PublicationStatus;
}) {
  const res = await api.post<Publication>("/publications", data);
  return res.data;
}

export async function fetchPublication(id: string | number) {
  const res = await api.get<Publication>(`/publications/${id}`);
  return res.data;
}

export async function updatePublication(
  id: string | number,
  data: Partial<Pick<Publication, "title" | "content" | "status">>
) {
  const res = await api.put<Publication>(`/publications/${id}`, data);
  return res.data;
}

export async function deletePublication(id: number) {
  const res = await api.delete(`/publications/${id}`);
  return res.data;
}

export async function bulkDelete(ids: number[]) {
  const res = await api.delete("/publications/bulk_delete", { params: { ids } });
  return res.data;
}

export async function fetchPublicFeed(): Promise<Publication[]> {
  const res = await api.get<Publication[]>("/publications/public_view");
  return res.data;
}
