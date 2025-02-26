import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingTripId, setReservingTripId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los viajes
        const tripsResponse = await fetch("https://rangerhub-back.vercel.app/trips");
        if (!tripsResponse.ok) throw new Error("Error al cargar viajes");
        const tripsData = await tripsResponse.json();
        setTrips(tripsData.trips || []);

        // Obtener reservas del usuario si está autenticado
        if (currentUser) {
          const reservationsResponse = await fetch(
            `https://rangerhub-back.vercel.app/reservations/user/${currentUser.id}`
          );
          const reservationsData = await reservationsResponse.json();
          setUserReservations(reservationsData.reservations || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  const filteredTrips = trips.filter(trip => 
    trip.trip_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isReserved = (tripId) => 
    userReservations.some(res => 
      res.trip_id === tripId && res.user_id === currentUser?.id
    );

  const handleReservation = async (tripId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setReservingTripId(tripId);
    
    try {
      const response = await fetch("https://rangerhub-back.vercel.app/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          user_id: currentUser.id,
          status: "pendiente"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al reservar");
      }

      const data = await response.json();
      setUserReservations(prev => [...prev, data.reservation]);
      alert("¡Reserva realizada con éxito!");
      navigate(`/secured/${currentUser.username}/dashboard/trips`);
    } catch (err) {
      alert(err.message);
    } finally {
      setReservingTripId(null);
    }
  };

  const handleCancelReservation = async (tripId) => {
    if (!currentUser) return;

    setReservingTripId(tripId);
    
    try {
      const response = await fetch(
        `https://rangerhub-back.vercel.app/reservations/trip/${tripId}/user/${currentUser.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response
        
        .json();
        throw new Error(errorData.message || "Error al cancelar");
      }

      setUserReservations(prev => 
        prev.filter(res => res.trip_id !== tripId)
      );
      alert("Reserva cancelada exitosamente");
    } catch (err) {
      alert(err.message);
    } finally {
      setReservingTripId(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="container text-center my-5">
        <h3>Debes iniciar sesión para ver los viajes</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/login')}
        >
          Ir a login
        </button>
      </div>
    );
  }

  return (
    <div className="trips-container">
      <nav className="navbar navbar-light bg-light sticky-top">
        <div className="container-fluid">
          <h1 className="navbar-brand">Viajes Disponibles</h1>
          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </nav>

      <div className="container mt-4">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando aventuras...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredTrips.length > 0 ? (
              filteredTrips.map(trip => (
                <div key={trip.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={trip.trip_image_url || "https://via.placeholder.com/300x200?text=Imagen+no+disponible"}
                      className="card-img-top trip-image"
                      alt={trip.trip_name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=Error+de+imagen";
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h3 className="card-title text-primary">{trip.trip_name}</h3>
                      <div className="mb-2">
                        <span className="badge bg-success fs-6">
                          ${trip.total_cost} USD
                        </span>
                      </div>
                      <p className="card-text flex-grow-1">{trip.description}</p>
                      
                      <div className="mt-auto">
                        {isReserved(trip.id) ? (
                          <button
                            onClick={() => handleCancelReservation(trip.id)}
                            className="btn btn-danger w-100"
                            disabled={reservingTripId === trip.id}
                          >
                            {reservingTripId === trip.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Procesando...
                              </>
                            ) : (
                              "Dar de baja"
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReservation(trip.id)}
                            className="btn btn-primary w-100"
                            disabled={reservingTripId === trip.id}
                          >
                            {reservingTripId === trip.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Reservando...
                              </>
                            ) : (
                              "¡Lo quiero!"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center my-5">
                <h4>🚫 No se encontraron viajes con ese criterio</h4>
                <button 
                  className="btn btn-outline-secondary mt-3"
                  onClick={() => setSearchTerm("")}
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};