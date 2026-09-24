import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import ParkingMap from '../components/Map/ParkingMap';

interface ParkingLot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  totalSpots: number;
}

export default function MapScreen() {
  const [parkings, setParkings] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(null);
  
  // Reservation state
  const { user } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [hours, setHours] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/parkinglots');
      if (response.data && Array.isArray(response.data)) {
         setParkings(response.data);
      }
    } catch (error) {
      console.warn("Error fetching parkings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReserve = () => {
    if (!selectedParking) return;
    setLicensePlate('');
    setHours('1');
    setIsModalVisible(true);
  };

  const submitReservation = async () => {
    if (!licensePlate || !hours || !selectedParking || !user) {
      Alert.alert('Error', 'Completá todos los campos.');
      return;
    }

    const duration = parseInt(hours);
    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Error', 'La duración debe ser un número válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      const payload = {
        parkingLotId: selectedParking.id,
        userId: user.sub,
        licensePlate: licensePlate,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      await api.post('/reservations', payload);
      Alert.alert('¡Éxito!', 'Tu reserva fue confirmada.');
      setIsModalVisible(false);
      setSelectedParking(null);
    } catch (error: any) {
      Alert.alert('Error', 'Hubo un problema al crear la reserva.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ParkingMap 
        parkings={parkings} 
        onSelectParking={setSelectedParking} 
      />

      {selectedParking && (
        <View style={styles.bottomSheet}>
          <Text style={styles.parkingName}>{selectedParking.name}</Text>
          <View style={styles.parkingDetails}>
            <Text style={styles.price}>${selectedParking.pricePerHour} / hora</Text>
            <Text style={styles.spots}>Capacidad: {selectedParking.totalSpots}</Text>
          </View>
          
          <TouchableOpacity style={styles.reserveButton} onPress={handleOpenReserve}>
            <Text style={styles.reserveButtonText}>Comenzar Reserva</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reservation Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reservar en {selectedParking?.name}</Text>
            
            <Text style={styles.label}>Patente / Matrícula</Text>
            <TextInput 
              style={styles.input}
              placeholder="Ej: AB123CD"
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Horas de Estadia</Text>
            <TextInput 
              style={styles.input}
              placeholder="Ej: 2"
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmBtn]} 
                onPress={submitReservation}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmBtnText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 9999,
  },
  parkingName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  parkingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  price: {
    fontSize: 18,
    color: '#0066cc',
    fontWeight: '600',
  },
  spots: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  reserveButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#28a745',
    marginLeft: 10,
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
