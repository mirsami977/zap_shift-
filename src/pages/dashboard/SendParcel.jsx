import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api, apiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { useRegions } from "../../hooks/useRegions";
import Alert from "../../components/ui/Alert";

const emptyForm = {
  type: "document",
  title: "",
  weight: 0,
  senderName: "",
  senderPhone: "",
  senderRegion: "",
  senderDistrict: "",
  senderAddress: "",
  pickupInstruction: "",
  receiverName: "",
  receiverPhone: "",
  receiverRegion: "",
  receiverDistrict: "",
  receiverAddress: "",
  deliveryInstruction: "",
};

const SendParcel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { regions } = useRegions();
  const [form, setForm] = useState({ ...emptyForm, senderName: user?.name || "", senderPhone: user?.phone || "" });
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const districtsFor = (region) => regions.find((entry) => entry.region === region)?.districts ?? [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "senderRegion" ? { senderDistrict: "" } : {}),
      ...(name === "receiverRegion" ? { receiverDistrict: "" } : {}),
    }));
  };

  useEffect(() => {
    if (!form.senderDistrict || !form.receiverDistrict) return;

    api
      .post("/parcels/quote", {
        type: form.type,
        weight: Number(form.weight) || 0,
        senderDistrict: form.senderDistrict,
        receiverDistrict: form.receiverDistrict,
      })
      .then(({ data }) => setQuote(data))
      .catch(() => setQuote(null));
  }, [form.type, form.weight, form.senderDistrict, form.receiverDistrict]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/parcels", { ...form, weight: Number(form.weight) || 0 });
      navigate(`/dashboard/my-parcels?highlight=${data._id}`);
    } catch (submitError) {
      setError(apiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="input input-bordered w-full"
        {...extra}
      />
    </label>
  );

  const regionSelect = (name, label) => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
      <select name={name} value={form[name]} onChange={handleChange} required className="select select-bordered w-full">
        <option value="">Select region</option>
        {regions.map((entry) => (
          <option key={entry.region} value={entry.region}>
            {entry.region}
          </option>
        ))}
      </select>
    </label>
  );

  const districtSelect = (name, label, region) => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
      <select name={name} value={form[name]} onChange={handleChange} required className="select select-bordered w-full">
        <option value="">Select district</option>
        {districtsFor(region).map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3B36]">Send a parcel</h1>
        <p className="text-sm text-gray-500">Door to door delivery in every district of Bangladesh.</p>
      </div>

      <Alert type="error">{error}</Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700">Parcel type</span>
          <select name="type" value={form.type} onChange={handleChange} className="select select-bordered w-full">
            <option value="document">Document</option>
            <option value="non-document">Non-document</option>
          </select>
        </label>
        {field("title", "Parcel name", { required: true, placeholder: "Books, laptop..." })}
        {field("weight", "Weight (kg)", {
          type: "number",
          min: 0,
          step: 0.1,
          disabled: form.type === "document",
        })}
      </div>

      <fieldset className="rounded-2xl border border-gray-100 p-5">
        <legend className="px-2 font-bold text-[#024950]">Sender info</legend>
        <div className="grid gap-4 md:grid-cols-2">
          {field("senderName", "Sender name", { required: true })}
          {field("senderPhone", "Sender phone", { required: true })}
          {regionSelect("senderRegion", "Sender region")}
          {districtSelect("senderDistrict", "Sender district", form.senderRegion)}
          {field("senderAddress", "Pickup address", { required: true })}
          {field("pickupInstruction", "Pickup instruction")}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-gray-100 p-5">
        <legend className="px-2 font-bold text-[#024950]">Receiver info</legend>
        <div className="grid gap-4 md:grid-cols-2">
          {field("receiverName", "Receiver name", { required: true })}
          {field("receiverPhone", "Receiver phone", { required: true })}
          {regionSelect("receiverRegion", "Receiver region")}
          {districtSelect("receiverDistrict", "Receiver district", form.receiverRegion)}
          {field("receiverAddress", "Delivery address", { required: true })}
          {field("deliveryInstruction", "Delivery instruction")}
        </div>
      </fieldset>

      {quote && form.senderDistrict && form.receiverDistrict && (
        <div className="rounded-2xl bg-[#F2F5F6] p-5">
          <p className="text-sm font-semibold uppercase text-gray-500">Estimated cost</p>
          <p className="text-3xl font-extrabold text-[#024950]">৳{quote.cost}</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            {quote.breakdown.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-[#C1E840] px-8 py-3 font-bold text-[#0D3B36] transition hover:bg-[#b2d935] disabled:opacity-60"
      >
        {submitting ? "Booking..." : "Book parcel"}
      </button>
    </form>
  );
};

export default SendParcel;
