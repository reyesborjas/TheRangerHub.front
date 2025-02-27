import { useEffect, useState } from "react";

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

  // Añadir esta parte para el filtrado
  const filteredTrips = trips.filter(trip => 
    trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trip.description && trip.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
    const response = await fetch("https://rangerhub-back.vercel.app/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Error al reservar viaje");
  } 
    const data = await response.json();
    console.log(data);
    alert("Reserva realizada con éxito");
    setReservingTripId(null);
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

                    {
                      (currentUser?.role_name !== 'Ranger') ?  <button
                      onClick={() => handleReservation(trip.id)}
                      className="btn btn-primary"
                      disabled={reservingTripId === trip.id}
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
                    </button> : ""
                    }
                   
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