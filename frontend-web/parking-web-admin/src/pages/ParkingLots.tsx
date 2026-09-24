import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  pricePerHour: number;
  latitude: number;
  longitude: number;
}

// Sub-component to handle map clicks
function LocationMarker({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// Sub-component to dynamically change map center
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function ParkingLots() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLotId, setEditingLotId] = useState<string | null>(null);
  const { token, logout } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState('');
  
  // Default coordinates (Buenos Aires)
  const defaultPosition: [number, number] = [-34.6037, -58.3816];
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  const fetchParkingLots = () => {
    fetch('http://localhost:5190/api/parkinglots', {
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
        setParkingLots(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching parking lots", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchParkingLots();
  }, [token]);

  const openCreateModal = () => {
    setEditingLotId(null);
    setName('');
    setAddress('');
    setCapacity('');
    setPrice('');
    setPosition(defaultPosition);
    setIsModalOpen(true);
  };

  const openEditModal = (lot: ParkingLot) => {
    setEditingLotId(lot.id);
    setName(lot.name);
    setAddress(lot.address);
    setCapacity(lot.totalSpots.toString());
    setPrice(lot.pricePerHour.toString());
    
    // Set coordinates if they exist and are not 0,0 (default)
    if (lot.latitude !== 0 && lot.longitude !== 0) {
      setPosition([lot.latitude, lot.longitude]);
    } else {
      setPosition(defaultPosition);
    }
    
    setIsModalOpen(true);
  };

  const handleSearchAddress = async () => {
    if (!address) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
      } else {
        alert('Dirección no encontrada en el mapa');
      }
    } catch (e) {
      console.error(e);
      alert('Error buscando dirección');
    }
  };

  const handleSaveLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      const url = editingLotId 
        ? `http://localhost:5190/api/parkinglots/${editingLotId}`
        : 'http://localhost:5190/api/parkinglots';
        
      const method = editingLotId ? 'PUT' : 'POST';
      
      const payload = {
        name,
        address,
        totalSpots: parseInt(capacity),
        pricePerHour: parseFloat(price),
        latitude: position[0],
        longitude: position[1],
        ...(editingLotId && { id: editingLotId }) // Include ID if editing
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchParkingLots();
      } else {
        setFormError('Error saving parking lot');
      }
    } catch (err) {
      setFormError('Network error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parking Lots Management</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Lot
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : parkingLots.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No parking lots found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Hr</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parkingLots.map((lot) => (
                <tr key={lot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lot.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.totalSpots} spots</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openEditModal(lot)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSaveLot}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingLotId ? 'Edit Parking Lot' : 'Add New Parking Lot'}
                  </h3>
                  
                  {formError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{formError}</div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <div className="flex mt-1 shadow-sm rounded-md">
                          <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="flex-1 block w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <button type="button" onClick={handleSearchAddress} className="inline-flex items-center px-3 rounded-r-md border border-y border-r border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100 cursor-pointer font-medium">
                            ?? Buscar
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Spots</label>
                        <input type="number" min="1" required value={capacity} onChange={e => setCapacity(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price Per Hour ($)</label>
                        <input type="number" min="0" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                    </div>
                    
                    {/* Map Section */}
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location (Click to move marker)</label>
                      <div className="h-64 w-full rounded-md border border-gray-300 overflow-hidden relative z-0">
                        <MapContainer 
                          center={position} 
                          zoom={13} 
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={true}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationMarker position={position} setPosition={setPosition} />
                          <MapUpdater position={position} />
                        </MapContainer>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Lat: {position[0].toFixed(6)} | Lng: {position[1].toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse relative z-10">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer">
                    Save
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
