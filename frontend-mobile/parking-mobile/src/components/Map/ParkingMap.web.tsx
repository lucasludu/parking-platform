import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importante para que el mapa se vea bien
import L from 'leaflet';

const { width, height } = Dimensions.get('window');

// Fix para los iconos de leaflet en react
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface ParkingMapProps {
  parkings: any[];
  onSelectParking: (parking: any | null) => void;
}

// Componente para detectar clics en el mapa y deseleccionar
function MapEvents({ onSelectParking }: { onSelectParking: (p: null) => void }) {
  useMapEvents({
    click() {
      onSelectParking(null);
    },
  });
  return null;
}

export default function ParkingMap({ parkings, onSelectParking }: ParkingMapProps) {
  useEffect(() => {
    // Para asegurarnos que los estilos CSS de Leaflet carguen correctamente en el head del navegador
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-container {
        width: 100%;
        height: 100vh;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    }
  }, []);

  const centerLat = parkings.length > 0 ? parkings[0].latitude : -34.6037;
  const centerLng = parkings.length > 0 ? parkings[0].longitude : -58.3816;

  return (
    <View style={styles.container}>
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={14} 
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onSelectParking={onSelectParking} />
        
        {parkings.map(parking => {
          // Asegurar que las coordenadas son números válidos
          const lat = Number(parking.latitude) || 0;
          const lng = Number(parking.longitude) || 0;
          if (lat === 0 && lng === 0) return null; // Evitar renderizar en [0,0] si hubo error

          return (
            <Marker 
              key={parking.id} 
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  onSelectParking(parking);
                },
              }}
            >
              <Popup>
                <b>{parking.name}</b><br/>
                ${parking.pricePerHour}/hora
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%', // Usa toda la pantalla
    position: 'absolute', // Asegura que quede de fondo
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
