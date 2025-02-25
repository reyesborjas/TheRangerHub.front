import { useEffect, useState } from "react";

export const Trips = () => {
  let [trips, setTrips] = useState([]);
  let [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    fetch("https://rangerhub-back.vercel.app/trips")
      .then((response) => {
        return response.json();
      })
      .then((responseConverted) => {
        setTrips(responseConverted.trips);
      })
      .catch((error) => console.log(error));
  }, []);

  // Filtra los viajes según el término de búsqueda
  const filteredTrips = trips.filter((trip) =>
    trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Página de viajes</h1>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Navbar</a>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar viaje..."
              aria-label="Search"
              value={searchTerm} // Vincula el input con el estado
              onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado cuando cambie el input
            />
            <button className="btn btn-outline-success" type="submit">
              Buscar
            </button>
          </form>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          {trips.length > 0 &&
            (filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => {
                return (
                  <div className="col-4" key={trip.id}>
                    <div className="card">
                      <img
                        src={trip.trip_image_url}
                        className="card-img-top"
                        alt="..."
                      />
                      <div className="card-body">
                        <h3 className="card-title">{trip.trip_name}</h3>
                        <h5>Precio ${trip.total_cost}</h5>
                        <p className="card-text">{trip.description}</p>
                        <a href="#" className="btn btn-primary">
                          Lo quiero!
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No se encontraron viajes</p>
            ))}
        </div>
      </div>
    </div>
  );
};
