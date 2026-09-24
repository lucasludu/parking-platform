import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Reservation {
  id: string;
  driverId: string;
  parkingLotId: string;
  licensePlate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5190/api/reservations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reservations", err);
        setLoading(false);
      });
  }, [token, logout]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Reservations</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reservations found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 uppercase">{res.licensePlate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(res.startTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(res.endTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${res.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
