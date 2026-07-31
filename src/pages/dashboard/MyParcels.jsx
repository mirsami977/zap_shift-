import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";
import StatusBadge from "../../components/ui/StatusBadge";

const MyParcels = () => {
  const [parcels, setParcels] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    api
      .get("/parcels")
      .then(({ data }) => setParcels(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, []);

  useEffect(load, [load]);

  const pay = async (parcel) => {
    setError("");
    try {
      const { data } = await api.post(`/payments/${parcel._id}/pay`);
      setMessage(`Payment successful for ${parcel.trackingId} (${data.transactionId})`);
      load();
    } catch (payError) {
      setError(apiErrorMessage(payError));
    }
  };

  const cancel = async (parcel) => {
    setError("");
    try {
      await api.delete(`/parcels/${parcel._id}`);
      setMessage(`Parcel ${parcel.trackingId} deleted`);
      load();
    } catch (deleteError) {
      setError(apiErrorMessage(deleteError));
    }
  };

  if (!parcels) return <Loading label="Loading parcels..." />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#0D3B36]">My parcels</h1>
      <Alert type="error">{error}</Alert>
      <Alert type="success">{message}</Alert>

      {parcels.length === 0 ? (
        <p className="text-sm text-gray-500">
          No parcels yet.{" "}
          <Link to="/dashboard/send-parcel" className="font-semibold text-[#024950] underline">
            Book your first parcel
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Parcel</th>
                <th>Route</th>
                <th>Cost</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td className="font-mono text-xs">{parcel.trackingId}</td>
                  <td>{parcel.title}</td>
                  <td className="text-xs">
                    {parcel.senderDistrict} → {parcel.receiverDistrict}
                  </td>
                  <td>৳{parcel.cost}</td>
                  <td>
                    <StatusBadge status={parcel.paymentStatus} />
                  </td>
                  <td>
                    <StatusBadge status={parcel.deliveryStatus} />
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    {parcel.paymentStatus === "unpaid" && (
                      <button
                        type="button"
                        onClick={() => pay(parcel)}
                        className="rounded-full bg-[#C1E840] px-3 py-1 text-xs font-bold text-[#0D3B36]"
                      >
                        Pay
                      </button>
                    )}
                    <Link to={`/track/${parcel.trackingId}`} className="text-xs font-semibold text-[#024950] underline">
                      Track
                    </Link>
                    {parcel.paymentStatus === "unpaid" && (
                      <button
                        type="button"
                        onClick={() => cancel(parcel)}
                        className="text-xs font-semibold text-red-600 underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyParcels;
