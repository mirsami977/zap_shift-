import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (submitError) {
      setError(apiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-1 text-3xl font-extrabold text-[#0D3B36]">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-500">Login to book and track your parcels.</p>

      {/* Quick Demo Credentials */}
      <div className="mb-6 rounded-2xl bg-gray-50 p-4 border border-gray-100">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Quick Demo Accounts:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setForm({ email: "user@zapshift.com", password: "123456" })}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setForm({ email: "rider@zapshift.com", password: "123456" })}
            className="rounded-xl border border-sky-200 bg-sky-50 px-2 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition"
          >
            Rider
          </button>
          <button
            type="button"
            onClick={() => setForm({ email: "admin@zapshift.com", password: "admin123" })}
            className="rounded-xl border border-purple-200 bg-purple-50 px-2 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition"
          >
            Admin
          </button>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Alert type="error">{error}</Alert>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#C1E840] py-3 font-bold text-[#0D3B36] transition hover:bg-[#b2d935] disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        New to zapShift?{" "}
        <Link to="/register" className="font-semibold text-[#024950] underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
