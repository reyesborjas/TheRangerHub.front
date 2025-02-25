import { useEffect, useState } from "react";

export const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [reservingTripId, setReservingTripId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://rangerhub-back.vercel.app/trips")
      .then((response) => response.json())
      .then((responseConverted) => {
        setTrips(responseConverted.trips);
      })
      .catch((error) => console.log(error));
  }, []);

  // Añadir esta parte para el filtrado
  const filteredTrips = trips.filter(trip => 
    trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trip.description && trip.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReservation = async (tripId) => {
    // ... (mantener igual tu lógica de reservas)
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Mira los viajes que ofrecemos</a>
          <form className="d-flex">
            <input
              type="text"
              placeholder="Buscar viajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Cambiar a type="button" para evitar submit del formulario */}
            <button 
              className="btn btn-outline-success" 
              type="button" // Importante este cambio
            >
              Buscar
            </button>
          </form>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          {/* Cambiar trips por filteredTrips aquí */}
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip, index) => (
              <div key={trip._id || index} className="col-4">
                <div className="card">
                  <img
                    src={trip.trip_image_url}
                    className="card-img-top"
                    alt="Imagen del viaje"
                  />
                  <div className="card-body">
                    <h3 className="card-title">{trip.trip_name}</h3>
                    <h5>Precio ${trip.total_cost}</h5>
                    <p className="card-text">{trip.description}</p>
                    <button
                      onClick={() => handleReservation(trip._id)}
                      className="btn btn-primary"
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
                      ) : (
                        "Lo quiero!"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Añadir mensaje cuando no hay resultados
            <div className="col-12 text-center my-5">
              <h3>No se encontraron viajes con ese criterio de búsqueda</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};