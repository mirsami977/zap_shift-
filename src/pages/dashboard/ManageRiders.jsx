import { useCallback, useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";
import StatusBadge from "../../components/ui/StatusBadge";

const ManageRiders = () => {
  const [riders, setRiders] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .get("/riders", { params: statusFilter ? { status: statusFilter } : {} })
      .then(({ data }) => setRiders(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, [statusFilter]);

  useEffect(load, [load]);

  const setStatus = async (riderId, status) => {
    setError("");
    try {
      await api.patch(`/riders/${riderId}/status`, { status });
      load();
    } catch (updateError) {
      setError(apiErrorMessage(updateError));
    }
  };

  if (!riders) return <Loading label="Loading riders..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-[#0D3B36]">Manage riders</h1>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="select select-bordered select-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Alert type="error">{error}</Alert>

      {riders.length === 0 ? (
        <p className="text-sm text-gray-500">No rider applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Area</th>
                <th>Bike</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id}>
                  <td>{rider.name}</td>
                  <td className="text-xs">
                    {rider.email}
                    <br />
                    {rider.phone}
                  </td>
                  <td className="text-xs">
                    {rider.district}, {rider.region}
                  </td>
                  <td className="text-xs">
                    {rider.bikeBrand} {rider.bikeRegistration}
                  </td>
                  <td>
                    <StatusBadge status={rider.status} />
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    {rider.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => setStatus(rider._id, "approved")}
                        className="rounded-full bg-[#C1E840] px-3 py-1 text-xs font-bold text-[#0D3B36]"
                      >
                        Approve
                      </button>
                    )}
                    {rider.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => setStatus(rider._id, "rejected")}
                        className="text-xs font-semibold text-red-600 underline"
                      >
                        Reject
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

export default ManageRiders;
