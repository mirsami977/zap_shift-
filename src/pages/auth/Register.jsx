import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", photoURL: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(apiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-1 text-3xl font-extrabold text-[#0D3B36]">Create your account</h1>
      <p className="mb-6 text-sm text-gray-500">Send parcels across all 64 districts.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Alert type="error">{error}</Alert>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Name</span>
          <input name="name" required value={form.name} onChange={handleChange} className="input input-bordered w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Email</span>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className="input input-bordered w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Phone</span>
          <input name="phone" value={form.phone} onChange={handleChange} className="input input-bordered w-full" placeholder="01XXXXXXXXX" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Photo URL (optional)</span>
          <input name="photoURL" value={form.photoURL} onChange={handleChange} className="input input-bordered w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="At least 6 characters"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#C1E840] py-3 font-bold text-[#0D3B36] transition hover:bg-[#b2d935] disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#024950] underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
