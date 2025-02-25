import { useEffect, useState } from "react";

export const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [reservingTripId, setReservingTripId] = useState(null);

  useEffect(() => {
    fetch("https://rangerhub-back.vercel.app/trips")
      .then((response) => response.json())
      .then((responseConverted) => {
        setTrips(responseConverted.trips);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleReservation = async (tripId) => {
    // Obtener datos del usuario desde localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      window.location.href = "/login";
      return;
    }
    setReservingTripId(tripId);

    try {
      const response = await fetch(
        "https://rangerhub-back.vercel.app/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            trip_id: tripId,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }

      alert("¡Reserva exitosa!");
    } catch (error) {
      console.error(error);
      alert(error.message);
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
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          {trips.length > 0 &&
            trips.map((trip, index) => (
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
            ))}
        </div>
      </div>
    </div>
  );
};
