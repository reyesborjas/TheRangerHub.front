import { useEffect, useState } from "react";

export const Trips = () => {
  let [trips, setTrips] = useState([]);

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
            trips.map((trip) => {
              return (
                <div className="col-4">
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
            })}
        </div>
      </div>
    </div>
  );
};
