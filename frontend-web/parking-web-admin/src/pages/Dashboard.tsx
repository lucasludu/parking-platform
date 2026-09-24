import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Ticket, Building, Users } from 'lucide-react';

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalReservations: number;
  totalUsers: number;
  totalParkingLots: number;
  revenueLast7Days: DailyRevenue[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5190/api/stats/dashboard', {
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
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats", err);
        setLoading(false);
      });
  }, [token, logout]);

  if (loading || !stats) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reservations</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Parking Lots</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalParkingLots}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Users</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue - Last 7 Days</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.revenueLast7Days} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
