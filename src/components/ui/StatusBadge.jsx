const labels = {
  unpaid: { text: "Unpaid", className: "bg-amber-100 text-amber-800" },
  paid: { text: "Paid", className: "bg-blue-100 text-blue-800" },
  rider_assigned: { text: "Rider assigned", className: "bg-indigo-100 text-indigo-800" },
  in_transit: { text: "In transit", className: "bg-purple-100 text-purple-800" },
  delivered: { text: "Delivered", className: "bg-green-100 text-green-800" },
  cancelled: { text: "Cancelled", className: "bg-red-100 text-red-800" },
  pending: { text: "Pending", className: "bg-amber-100 text-amber-800" },
  approved: { text: "Approved", className: "bg-green-100 text-green-800" },
  rejected: { text: "Rejected", className: "bg-red-100 text-red-800" },
};

const StatusBadge = ({ status }) => {
  const detail = labels[status] || { text: status, className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${detail.className}`}>
      {detail.text}
    </span>
  );
};

export default StatusBadge;
