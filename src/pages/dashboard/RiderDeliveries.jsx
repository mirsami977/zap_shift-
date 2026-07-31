import { useCallback, useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";
import StatusBadge from "../../components/ui/StatusBadge";

const RiderDeliveries = () => {
  const [parcels, setParcels] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .get("/parcels")
      .then(({ data }) => setParcels(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, []);

  useEffect(load, [load]);

  const updateStatus = async (parcelId, status) => {
    setError("");
    try {
      await api.patch(`/parcels/${parcelId}/status`, { status, note: "Updated by rider" });
      load();
    } catch (statusError) {
      setError(apiErrorMessage(statusError));
    }
  };

  if (!parcels) return <Loading label="Loading deliveries..." />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#0D3B36]">My deliveries</h1>
      <Alert type="error">{error}</Alert>

      {parcels.length === 0 ? (
        <p className="text-sm text-gray-500">No parcels assigned to you yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {parcels.map((parcel) => (
            <div key={parcel._id} className="rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs">{parcel.trackingId}</p>
                <StatusBadge status={parcel.deliveryStatus} />
              </div>
              <h2 className="mt-2 font-bold text-[#024950]">{parcel.title}</h2>
              <p className="text-xs text-gray-600">
                Pickup: {parcel.senderAddress}, {parcel.senderDistrict} ({parcel.senderPhone})
              </p>
              <p className="text-xs text-gray-600">
                Deliver: {parcel.receiverAddress}, {parcel.receiverDistrict} ({parcel.receiverPhone})
              </p>
              <div className="mt-3 space-x-2">
                {parcel.deliveryStatus !== "in_transit" && parcel.deliveryStatus !== "delivered" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(parcel._id, "in_transit")}
                    className="rounded-full bg-[#024950] px-3 py-1 text-xs font-bold text-white"
                  >
                    Picked up
                  </button>
                )}
                {parcel.deliveryStatus !== "delivered" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(parcel._id, "delivered")}
                    className="rounded-full bg-[#C1E840] px-3 py-1 text-xs font-bold text-[#0D3B36]"
                  >
                    Mark delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderDeliveries;
