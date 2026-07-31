import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/parcels/stats")
      .then(({ data }) => setStats(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!stats) return <Loading label="Loading your dashboard..." />;

  const cards = [
    { label: "Total parcels", value: stats.totalParcels },
    { label: "Paid revenue", value: `৳${stats.totalRevenue}` },
    { label: "In transit", value: stats.byStatus.in_transit ?? 0 },
    { label: "Delivered", value: stats.byStatus.delivered ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3B36]">Hello {user?.name}</h1>
        <p className="text-sm text-gray-500">Here is what is happening with your parcels.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-[#F2F5F6] p-5">
            <p className="text-xs font-semibold uppercase text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-[#024950]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 p-5">
        <h2 className="mb-3 font-bold text-[#0D3B36]">Parcels by status</h2>
        <ul className="space-y-2 text-sm">
          {Object.entries(stats.byStatus).length === 0 && (
            <li className="text-gray-500">No parcels yet.</li>
          )}
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <li key={status} className="flex justify-between border-b border-dashed py-1">
              <span className="capitalize">{status.replace("_", " ")}</span>
              <span className="font-bold">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
