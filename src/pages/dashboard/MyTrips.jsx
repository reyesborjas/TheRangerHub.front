import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [reservingTripId, setReservingTripId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decodificar el token para obtener user_id y role_id
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
        setUserRole(decoded.role_name);
        if(decoded.role_name === 'Explorer'){
          console.log('El usuario es explorer');
          getExplorerTrips(decoded.user_id);
        } else {
          console.log('El usuario es Ranger');
          getRangerTrips(decoded.user_id);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Error al verificar la autenticación");
      }
    } else {
      // Enviar al usuario al login TODO
      console.log("No se encontró token de autenticación");
    }
  }, []);

  const getExplorerTrips = (userId) => {
    setIsLoading(true);
    fetch(`https://rangerhub-back.vercel.app/reservations/explorer/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
        }
        return response.json();
      })
      .then((data) => setUserReservations(data.trips || []))
      .catch((error) => {
        console.error("Error al obtener reservaciones:", error);
        setError("No se pudieron cargar tus reservaciones");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  const getRangerTrips = (userId) => {
    setIsLoading(true);
    fetch(`https://rangerhub-back.vercel.app/reservations/ranger/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron obtener las reservaciones`);
        }
        return response.json();
      })
      .then((data) => setUserReservations(data.trips || []))
      .catch((error) => {
        console.error("Error al obtener reservaciones:", error);
        setError("No se pudieron cargar tus reservaciones");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

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
            {userReservations.length > 0 ? (
              userReservations.map((trip, index) => (
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