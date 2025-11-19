import api from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/login", { email, password });
  return res.data;
}

export async function signup(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/signup", {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  return res.data;
}
