import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          No account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          View public publications:{" "}
          <Link
            to="/public"
            className="text-green-600 hover:text-green-800 hover:underline"
          >
            Public feed
          </Link>
        </div>
      </div>
    </div>
  );
}
