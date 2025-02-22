// components/dashboard/PaymentHistory.tsx
export default function PaymentHistory() {
    const payments = [
      { date: '2023-10-01', amount: 1000, status: 'Paid' },
      { date: '2023-09-01', amount: 800, status: 'Paid' },
    ];
  
    return (
      <div className="border p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">PAYMENT HISTORY</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }