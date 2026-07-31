import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";

const PaymentHistory = () => {
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/payments/history")
      .then(({ data }) => setPayments(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!payments) return <Loading label="Loading payments..." />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#0D3B36]">Payment history</h1>
      {payments.length === 0 ? (
        <p className="text-sm text-gray-500">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Tracking ID</th>
                <th>Parcel</th>
                <th>Amount</th>
                <th>Paid at</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="font-mono text-xs">{payment.transactionId}</td>
                  <td className="font-mono text-xs">{payment.trackingId}</td>
                  <td>{payment.title}</td>
                  <td>৳{payment.cost}</td>
                  <td className="text-xs">{new Date(payment.paidAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
