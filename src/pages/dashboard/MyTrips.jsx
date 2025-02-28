import { useEffect, useState } from "react";
import "../../styles/MyTrips.css";
import TopNavbar from "../../components/TopNavbar.jsx";

export const MyTrips = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reserving, setReserving] = useState({ tripId: null, action: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Extraemos user_id y role_name sin usar jwt-decode
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

  const getExplorerTrips = (userId) => {
    setIsLoading(true);
    fetch(`https://rangerhub-back.vercel.app/reservations/explorer/${userId}`)
        .then((response) => {
          if (!response.ok)
            throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
          return response.json();
        })
        .then((data) => setUserReservations(data.trips || []))
        .catch((error) => {
          console.error("Error al obtener reservaciones:", error);
          setError("No se pudieron cargar tus reservaciones");
        })
        .finally(() => setIsLoading(false));
  };

  const getRangerTrips = (userId) => {
    setIsLoading(true);
    fetch(`https://rangerhub-back.vercel.app/reservations/ranger/${userId}`)
        .then((response) => {
          if (!response.ok)
            throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
          return response.json();
        })
        .then((data) => setUserReservations(data.trips || []))
        .catch((error) => {
          console.error("Error al obtener reservaciones:", error);
          setError("No se pudieron cargar tus reservaciones");
        })
        .finally(() => setIsLoading(false));
  };

  const handleReservation = async (tripId, action) => {
    setReserving({ tripId, action });
    try {
      let url = "https://rangerhub-back.vercel.app/reservations";
      let method = "POST";
      if (action === "cancel") {
        url = `https://rangerhub-back.vercel.app/reservations/${tripId}`;
        method = "DELETE";
      }
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({ user_id: userId, trip_id: tripId }) : null,
      });
      if (!response.ok) throw new Error("Error al procesar la reservación");
      userRole === "Explorer" ? getExplorerTrips(userId) : getRangerTrips(userId);
    } catch (error) {
      console.error("Error al procesar la reservación:", error);
      setError(error.message);
    } finally {
      setReserving({ tripId: null, action: null });
    }
  };

  const filteredTrips = userReservations.filter((trip) =>
      trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="my-trips-container container">
        <TopNavbar />
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
                                <button className="btn btn-details">Ver detalles</button>
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
      </div>
  );
};