import { useEffect, useState } from "react";
import "../../styles/Trips.css";

export const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [reservingTripId, setReservingTripId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetch("https://rangerhub-back.vercel.app/trips")
        .then((response) => response.json())
        .then((responseConverted) => {
          setTrips(responseConverted.trips);
        })
        .catch((error) => console.log(error));
  }, []);

  // Filtrado de viajes
  const filteredTrips = trips.filter((trip) =>
      trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.description &&
          trip.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReservation = async (tripId) => {
    if (!currentUser) {
      alert("Por favor, inicia sesión");
      return;
    }
    const userId = currentUser.id;
    setReservingTripId(tripId);

    try {
      const reservationData = {
        trip_id: tripId,
        user_id: currentUser.id,
        status: "pendiente"
      };
      const response = await fetch(
          "https://rangerhub-back.vercel.app/reservations",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData)
          }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Error al reservar viaje");
      }
      const data = await response.json();
      console.log(data);
      alert("Reserva realizada con éxito");
    } catch (error) {
      console.error("Error en la reservación:", error);
      alert(error.message || "Hubo un error al procesar tu reservación");
    } finally {
      setReservingTripId(null);
    }
  };

  return (
      <div className="my-trips-container container">
        <h1 className="text-center my-4">Lo que los Rangers Ofrecen</h1>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar viajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-search" type="button">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {filteredTrips.length > 0 ? (
            <div className="trips-grid">
              {filteredTrips.map((trip, index) => (
                  <div key={trip._id || index} className="trip-card">
                    <div className="trip-image-container">
                      <img
                          src={trip.trip_image_url}
                          alt="Imagen del viaje"
                          className="trip-image"
                      />
                      {currentUser && currentUser.role_name !== "Ranger" && (
                          <button
                              className="overlay-btn"
                              onClick={() => handleReservation(trip.id)}
                              disabled={reservingTripId === trip.id}
                          >
                            {reservingTripId === trip.id ? (
                                <>
                        <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                        ></span>
                                  <span> Procesando...</span>
                                </>
                            ) : (
                                "Reservar"
                            )}
                          </button>
                      )}
                    </div>
                    <div className="trip-info">
                      <h3 className="trip-title">{trip.trip_name}</h3>
                      <h5 className="trip-price">Precio ${trip.total_cost}</h5>
                      <p className="trip-description">{trip.description}</p>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <div className="no-results text-center my-5">
              <h3>No se encontraron viajes con ese criterio de búsqueda</h3>
            </div>
        )}
      </div>
  );
};