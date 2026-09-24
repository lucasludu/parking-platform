import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../api/axiosConfig';
import QRCode from 'react-native-qrcode-svg';

interface Reservation {
  id: string;
  parkingLotId: string;
  licensePlate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: number;
}

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations/me');
      if (response.data && Array.isArray(response.data)) {
        setReservations(response.data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
      }
    } catch (error) {
      console.error("Error fetching reservations", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
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
      <FlatList 
        data={reservations}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes reservas previas.</Text>
          </View>
        }
        renderItem={({item}) => {
          const statusText = item.status === 0 ? 'Pendiente' : item.status === 1 ? 'Activa' : item.status === 2 ? 'Completada' : 'Cancelada';
          const statusColor = item.status === 0 ? '#ffc107' : item.status === 1 ? '#0066cc' : item.status === 2 ? '#28a745' : '#dc3545';
          const isActive = item.status === 0 || item.status === 1;

          return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.licensePlate}>{item.licensePlate}</Text>
              <Text style={{...styles.status, color: statusColor}}>{statusText}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.infoContainer}>
                <Text style={styles.date}>Inicio: {new Date(item.startTime).toLocaleString()}</Text>
                <Text style={styles.date}>Fin: {new Date(item.endTime).toLocaleString()}</Text>
                <Text style={styles.price}>Total: ${item.totalAmount}</Text>
              </View>
              {isActive && (
                <View style={styles.qrContainer}>
                  <QRCode
                    value={item.id}
                    size={80}
                  />
                  <Text style={styles.qrText}>Escaneá al entrar</Text>
                </View>
              )}
            </View>
          </View>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    padding: 16
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    color: '#666',
    fontSize: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8
  },
  licensePlate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  status: {
    fontWeight: 'bold'
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1
  },
  date: {
    color: '#555',
    marginBottom: 4
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 8
  },
  qrContainer: {
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8
  },
  qrText: {
    fontSize: 10,
    color: '#666',
    marginTop: 6
  }
});
