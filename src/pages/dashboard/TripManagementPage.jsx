import React, { useState, useEffect } from 'react';
import TripDetailsModal from './TripDetailsModal';

function TripManagementPage() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to update trip status
  const updateTripStatus = async (tripId, newStatus) => {
    try {
      const response = await fetch('/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: tripId,
          trip_status: newStatus
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle error (show message, etc.)
        throw new Error(data.message || 'Error actualizando estado');
      }
      
      // Update the local state to reflect the new status
      setTrips(prevTrips => 
        prevTrips.map(trip => 
          trip.id === tripId 
            ? { ...trip, trip_status: newStatus } 
            : trip
        )
      );

      // If the selected trip is the one being updated
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(prev => ({ ...prev, trip_status: newStatus }));
      }

      // Optional: Show success notification
      console.log(data.message);
    } catch (error) {
      console.error('Error updating trip status:', error);
      // Optional: Show error notification to user
      // For example:
      // toast.error(error.message);
    }
  };

  // Fetch trips or handle trip selection
  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  // Fetch trips when component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
          throw new Error('Error fetching trips');
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      {/* Trip list or grid */}
      <div className="row">
        {trips.map(trip => (
          <div 
            key={trip.id} 
            className="col-md-4 mb-3"
            onClick={() => handleTripSelect(trip)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{trip.trip_name}</h5>
                <p className="card-text">
                  <span className={`badge ${
                    trip.trip_status === 'Confirmado' ? 'bg-success' :
                    trip.trip_status === 'Pendiente' ? 'bg-warning' :
                    'bg-danger'
                  }`}>
                    {trip.trip_status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetailsModal 
          trip={selectedTrip}
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={(newStatus) => {
            console.log('Parent component receiving status update:', newStatus);
            updateTripStatus(selectedTrip.id, newStatus);
          }}
        />
      )}
    </div>
  );
}

export default TripManagementPage;