import { useCallback, useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";
import StatusBadge from "../../components/ui/StatusBadge";

const AllParcels = () => {
  const [parcels, setParcels] = useState(null);
  const [riders, setRiders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    api
      .get("/parcels", { params: statusFilter ? { status: statusFilter } : {} })
      .then(({ data }) => setParcels(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, [statusFilter]);

  useEffect(load, [load]);

  useEffect(() => {
    api
      .get("/riders", { params: { status: "approved" } })
      .then(({ data }) => setRiders(data))
      .catch(() => setRiders([]));
  }, []);

  const assignRider = async (parcelId, riderId) => {
    if (!riderId) return;
    setError("");
    try {
      await api.patch(`/parcels/${parcelId}/assign`, { riderId });
      setMessage("Rider assigned");
      load();
    } catch (assignError) {
      setError(apiErrorMessage(assignError));
    }
  };

  const updateStatus = async (parcelId, status) => {
    if (!status) return;
    setError("");
    try {
      await api.patch(`/parcels/${parcelId}/status`, { status, note: "Updated by admin" });
      setMessage("Status updated");
      load();
    } catch (statusError) {
      setError(apiErrorMessage(statusError));
    }
  };

  if (!parcels) return <Loading label="Loading parcels..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-[#0D3B36]">All parcels</h1>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="select select-bordered select-sm"
        >
          <option value="">All statuses</option>
          {["unpaid", "paid", "rider_assigned", "in_transit", "delivered", "cancelled"].map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <Alert type="error">{error}</Alert>
      <Alert type="success">{message}</Alert>

      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Route</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Rider</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="font-mono text-xs">{parcel.trackingId}</td>
                <td className="text-xs">{parcel.senderEmail}</td>
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
                <td className="text-xs">
                  {parcel.assignedRider?.email || (
                    <select
                      defaultValue=""
                      onChange={(event) => assignRider(parcel._id, event.target.value)}
                      className="select select-bordered select-xs"
                      disabled={parcel.paymentStatus !== "paid"}
                    >
                      <option value="">Assign rider</option>
                      {riders.map((rider) => (
                        <option key={rider._id} value={rider._id}>
                          {rider.name} ({rider.district})
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  <select
                    value=""
                    onChange={(event) => updateStatus(parcel._id, event.target.value)}
                    className="select select-bordered select-xs"
                  >
                    <option value="">Set status</option>
                    {["in_transit", "delivered", "cancelled"].map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllParcels;
