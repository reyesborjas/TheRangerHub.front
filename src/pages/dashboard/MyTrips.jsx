import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [reservingTripId, setReservingTripId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decodificar el token para obtener user_id y role_id
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
        setRoleId(decoded.role_id);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Error al verificar la autenticación");
      }
    } else {
      console.log("No se encontró token de autenticación");
    }
  }, []);

  // Obtener el nombre del rol del usuario
  useEffect(() => {
    if (roleId) {
      setIsLoading(true);
      fetch("https://rangerhub-back.vercel.app/roles")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener información de roles`);
          }
          return response.json();
        })
        .then((data) => {
          const role = data.roles.find((r) => r.id === roleId);
          setUserRole(role?.role_name);
        })
        .catch((error) => {
          console.error("Error al obtener roles:", error);
          setError("No se pudieron cargar los roles");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [roleId]);

  // Obtener reservas para Explorers
  useEffect(() => {
    if (userRole === "Explorer" && userId) {
      setIsLoading(true);
      fetch(`https://rangerhub-back.vercel.app/reservations?user_id=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
          }
          return response.json();
        })
        .then((data) => setUserReservations(data.reservations || []))
        .catch((error) => {
          console.error("Error al obtener reservaciones:", error);
          setError("No se pudieron cargar tus reservaciones");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userRole, userId]);

  // Obtener viajes según el rol
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        let url;
        if (userRole === "Ranger" && userId) {
          url = `https://rangerhub-back.vercel.app/trips/ranger/${userId}`;
        } else if (userRole === "Explorer" && userId) {
          url = `https://rangerhub-back.vercel.app/trips/explorer/${userId}`;
        } else {
          url = "https://rangerhub-back.vercel.app/trips";
        }
  
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setTrips(data.trips || []);
        
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips([]);
      }
    };
  
    fetchTrips();
  }, [userRole, userId]);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.trip_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.description &&
        trip.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReservation = async (tripId) => {
    if (!userId || userRole !== "Explorer") return;

    const reservation = userReservations.find((r) => r.trip_id === tripId);
    setReservingTripId(tripId);

    try {
      if (reservation) {
        // Cancelar reserva
        const response = await fetch(
          `https://rangerhub-back.vercel.app/reservations/${reservation.id}`,
          { method: "DELETE" }
        );
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cancelar la reserva`);
        }
        
        setUserReservations((prev) =>
          prev.filter((r) => r.id !== reservation.id)
        );
      } else {
        // Crear reserva
        const response = await fetch("https://rangerhub-back.vercel.app/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trip_id: tripId,
            user_id: userId,
            status: "pendiente",
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo crear la reserva`);
        }
        
        // Actualizar reservas
        const res = await fetch(
          `https://rangerhub-back.vercel.app/reservations?user_id=${userId}`
        );
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudieron obtener las reservaciones`);
        }
        
        const data = await res.json();
        setUserReservations(data.reservations || []);
      }
    } catch (error) {
      console.error("Error en la reservación:", error);
      alert(error.message || "Hubo un error al procesar tu reservación");
    } finally {
      setReservingTripId(null);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Mira los viajes que ofrecemos</a>
          <form className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar viajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-success" type="button">
              Buscar
            </button>
          </form>
        </div>
      </nav>
      <div className="container mt-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip, index) => (
                <div key={trip._id || index} className="col-md-4 mb-4">
                  <div className="card h-100">
                    {trip.trip_image_url ? (
                      <img
                        src={trip.trip_image_url}
                        className="card-img-top"
                        alt="Imagen del viaje"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    ) : (
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center" 
                        style={{ height: "200px" }}
                      >
                        <p className="text-muted">Sin imagen</p>
                      </div>
                    )}
                    <div className="card-body">
                      <h3 className="card-title">{trip.trip_name}</h3>
                      <h5>Precio ${trip.total_cost}</h5>
                      <p className="card-text">{trip.description}</p>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      {userRole === "Explorer" && (
                        <button
                          onClick={() => handleReservation(trip._id)}
                          className={`btn ${
                            userReservations.some(r => r.trip_id === trip._id)
                              ? "btn-danger"
                              : "btn-primary"
                          } w-100`}
                          disabled={reservingTripId === trip._id}
                        >
                          {reservingTripId === trip._id ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                aria-hidden="true"
                              ></span>
                              <span role="status"> Procesando...</span>
                            </>
                          ) : userReservations.some(r => r.trip_id === trip._id) ? (
                            "Cancelar viaje"
                          ) : (
                            "¡Lo quiero!"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center my-5">
                <h3>No se encontraron viajes con ese criterio de búsqueda</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};