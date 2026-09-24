import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface ParkingMapProps {
  parkings: any[];
  onSelectParking: (parking: any | null) => void;
}

export default function ParkingMap({ parkings, onSelectParking }: ParkingMapProps) {
  const centerLat = parkings.length > 0 ? parkings[0].latitude : -34.6037;
  const centerLng = parkings.length > 0 ? parkings[0].longitude : -58.3816;

  return (
    <MapView 
      style={styles.map}
      initialRegion={{
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onPress={() => onSelectParking(null)} // Deseleccionar al tocar el mapa
    >
      {parkings.map(parking => (
        <Marker
          key={parking.id}
          coordinate={{ latitude: parking.latitude, longitude: parking.longitude }}
          title={parking.name}
          description={`$${parking.pricePerHour}/hora`}
          onPress={(e) => {
            e.stopPropagation();
            onSelectParking(parking);
          }}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height,
  }
});
