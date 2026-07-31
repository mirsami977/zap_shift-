import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { useRegions } from "../../hooks/useRegions";
import Alert from "../../components/ui/Alert";
import StatusBadge from "../../components/ui/StatusBadge";

const BeARider = () => {
  const { user } = useAuth();
  const { regions } = useRegions();
  const [application, setApplication] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: 20,
    nid: "",
    region: "",
    district: "",
    bikeBrand: "",
    bikeRegistration: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/riders/me")
      .then(({ data }) => setApplication(data))
      .catch(() => setApplication(null));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "region" ? { district: "" } : {}) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/riders/apply", { ...form, age: Number(form.age) });
      setApplication(data);
    } catch (submitError) {
      setError(apiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  if (application) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-extrabold text-[#0D3B36]">Rider application</h1>
        <p className="text-sm text-gray-500">
          Your application for {application.district}, {application.region} is:
        </p>
        <StatusBadge status={application.status} />
        {application.status === "approved" && (
          <Alert type="success">You are an approved rider. Log out and back in to see deliveries.</Alert>
        )}
      </div>
    );
  }

  const districts = regions.find((entry) => entry.region === form.region)?.districts ?? [];

  const field = (name, label, extra = {}) => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
      <input name={name} value={form[name]} onChange={handleChange} className="input input-bordered w-full" {...extra} />
    </label>
  );

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3B36]">Be a rider</h1>
        <p className="text-sm text-gray-500">Earn with zapShift by delivering parcels in your area.</p>
      </div>
      <Alert type="error">{error}</Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {field("name", "Full name", { required: true })}
        {field("phone", "Phone", { required: true })}
        {field("age", "Age", { type: "number", min: 18, required: true })}
        {field("nid", "NID number", { required: true })}
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Region</span>
          <select name="region" value={form.region} onChange={handleChange} required className="select select-bordered w-full">
            <option value="">Select region</option>
            {regions.map((entry) => (
              <option key={entry.region} value={entry.region}>
                {entry.region}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">District</span>
          <select name="district" value={form.district} onChange={handleChange} required className="select select-bordered w-full">
            <option value="">Select district</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
        {field("bikeBrand", "Bike brand")}
        {field("bikeRegistration", "Bike registration number")}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-gray-700">Anything else?</span>
        <textarea name="note" value={form.note} onChange={handleChange} className="textarea textarea-bordered w-full" rows={3} />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-[#C1E840] px-8 py-3 font-bold text-[#0D3B36] transition hover:bg-[#b2d935] disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
};

export default BeARider;
