import { useEffect, useState } from "react";
import "../../styles/MyTrips.css";
import "../../styles/TripDetailsModal.css";
import TripDetailsModal from "./TripDetailsModal"; // Importamos el componente modal

export const MyTrips = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reserving, setReserving] = useState({ tripId: null, action: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.user_id);
        setUserRole(decoded.role_name);
        if (decoded.role_name === "Explorer") {
          getExplorerTrips(decoded.user_id);
        } else {
          getRangerTrips(decoded.user_id);
        }
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        setError("Error al verificar la autenticación");
      }
    } else {
      console.log("No se encontró token de autenticación");
    }
  }, []);

  const getExplorerTrips = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://rangerhub-back.vercel.app/reservations/explorer/${userId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
      }
      const data = await response.json();
      setUserReservations(data.trips || []);
      setError(null); // Limpiar cualquier error previo
      return data.trips || [];
    } catch (error) {
      console.error("Error al obtener reservaciones:", error);
      setError("No se pudieron cargar tus reservaciones");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getRangerTrips = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://rangerhub-back.vercel.app/reservations/ranger/${userId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
      }
      const data = await response.json();
      setUserReservations(data.trips || []);
      setError(null); // Limpiar cualquier error previo
      return data.trips || [];
    } catch (error) {
      console.error("Error al obtener reservaciones:", error);
      setError("No se pudieron cargar tus reservaciones");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservation = async (tripId, action) => {
    setReserving({ tripId, action });
    try {
        if (action === "cancel") {
            const response = await fetch(
                `https://rangerhub-back.vercel.app/reservations/trip/${tripId}/user/${userId}`, 
                {
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                    }
                }
            );
            
            const responseText = await response.text();
            
            if (!response.ok) {
                console.error("Server error response:", responseText);
                throw new Error(`Server error: ${response.status} - ${responseText}`);
            }
            
            // Parsear la respuesta JSON si es posible
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (jsonError) {
                console.warn("Response was not JSON:", jsonError);
                responseData = { message: responseText };
            }
            
            // Actualizar la lista de reservaciones localmente
            setUserReservations(prevReservations => 
                prevReservations.filter(reservation => reservation.trip_id !== tripId)
            );
            
            // Mostrar mensaje de éxito
            setError(responseData.message || "Reserva eliminada correctamente");
        }
    } catch (error) {
        console.error("Reservation processing error:", error);
        setError(`No se pudo procesar la reservación: ${error.message}`);
    } finally {
        setReserving({ tripId: null, action: null });
    }
};
  // Función para abrir el modal con detalles del viaje
  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTrip(null);
  };

  const filteredTrips = userReservations.filter((trip) =>
      trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="my-trips-container container">
        <h1 className="text-center my-4">Mis Viajes</h1>
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
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {isLoading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary"></div>
            </div>
        ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
              {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                      <div key={trip.id} className="col">
                        <div className="card h-100">
                          <img
                              src={trip.trip_image_url || "https://via.placeholder.com/200"}
                              className="card-img-top"
                              alt="Imagen del viaje"
                              style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <h3 className="card-title">{trip.trip_name}</h3>
                            <h5>Precio: ${trip.total_cost}</h5>
                            <p className="card-text">{trip.description}</p>
                          </div>
                          {userRole === "Explorer" ? (
                              <div className="card-footer button-group">
                                <button
                                    onClick={() => handleReservation(trip.id, "pay")}
                                    className="btn btn-pay"
                                    disabled={reserving.tripId === trip.id && reserving.action === "pay"}
                                >
                                  {reserving.tripId === trip.id && reserving.action === "pay"
                                      ? "Procesando..."
                                      : "Pagar"}
                                </button>
                                <button
                                    onClick={() => handleReservation(trip.id, "cancel")}
                                    className="btn btn-cancel"
                                    disabled={reserving.tripId === trip.id && reserving.action === "cancel"}
                                >
                                  {reserving.tripId === trip.id && reserving.action === "cancel"
                                      ? "Procesando..."
                                      : "Cancelar Viaje"}
                                </button>
                              </div>
                          ) : (
                              <div className="card-footer button-group">
                                <button 
                                  className="btn btn-details"
                                  onClick={() => handleViewDetails(trip)}
                                >
                                  Ver detalles
                                </button>
                              </div>
                          )}
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="col-12 text-center my-5">
                    <h3>No se encontraron viajes con ese criterio de búsqueda.</h3>
                  </div>
              )}
            </div>
        )}

        {/* Modal de detalles del viaje para Rangers */}
        {userRole === "Ranger" && (
          <TripDetailsModal 
            show={showModal} 
            trip={selectedTrip} 
            onClose={handleCloseModal} 
          />
        )}
      </div>
  );
};