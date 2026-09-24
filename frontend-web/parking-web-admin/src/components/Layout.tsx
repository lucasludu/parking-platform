import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Car, CalendarDays, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { name, logout } = useAuth();
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
            <Car className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">ParkFlow</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/" className="flex items-center px-4 py-3 text-gray-700 bg-gray-50 rounded-lg font-medium">
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/parking-lots" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <Car className="h-5 w-5 mr-3" />
              Parking Lots
            </Link>
            <Link to="/reservations" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <CalendarDays className="h-5 w-5 mr-3" />
              Reservations
            </Link>
            <Link to="/users" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <Users className="h-5 w-5 mr-3" />
              Users
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{name || 'Admin User'}</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {name ? name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
