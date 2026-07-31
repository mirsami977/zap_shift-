import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import StatusBadge from "../../components/ui/StatusBadge";

const TrackParcel = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(trackingId || "");
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trackingId) return;

    api
      .get(`/parcels/track/${trackingId.trim()}`)
      .then(({ data }) => {
        setParcel(data);
        setError("");
      })
      .catch((requestError) => {
        setParcel(null);
        setError(apiErrorMessage(requestError));
      });
  }, [trackingId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/track/${query.trim().toUpperCase()}`);
  };

  return (
    <div className="mx-auto my-10 max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-3xl font-extrabold text-[#0D3B36]">Track your parcel</h1>
      <p className="mb-6 text-sm text-gray-500">Enter the tracking ID you received when booking.</p>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ZS-20250101-ABC123"
          className="input input-bordered w-full"
        />
        <button type="submit" className="rounded-full bg-[#C1E840] px-6 font-bold text-[#0D3B36]">
          Track
        </button>
      </form>

      <Alert type="error">{error}</Alert>

      {parcel && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F2F5F6] p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm">{parcel.trackingId}</p>
              <StatusBadge status={parcel.deliveryStatus} />
            </div>
            <h2 className="mt-2 text-xl font-bold text-[#024950]">{parcel.title}</h2>
            <p className="text-sm text-gray-600">
              {parcel.senderDistrict} → {parcel.receiverDistrict}
            </p>
          </div>

          <ol className="space-y-3 border-l-2 border-dashed border-[#A1D6CB] pl-5">
            {parcel.trackingHistory.map((event, index) => (
              <li key={`${event.status}-${index}`}>
                <StatusBadge status={event.status} />
                <p className="mt-1 text-sm text-gray-700">{event.note}</p>
                <p className="text-xs text-gray-400">{new Date(event.at).toLocaleString()}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
