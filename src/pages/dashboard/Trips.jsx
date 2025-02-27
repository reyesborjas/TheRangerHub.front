import { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar.jsx";
import "../../styles/Trips.css"

export const Trips = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetch("https://rangerhub-back.vercel.app/trips")
            .then((response) => response.json())
            .then((data) => setTrips(data.trips))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div>
            <TopNavbar />

            <div className="trips-container container my-5">
                <h1 className="text-center mb-4">Página de viajes</h1>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                    {trips.map((trip) => (
                        <div className="col" key={trip.id}>
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={trip.trip_image_url}
                                    className="card-img-top"
                                    alt={trip.trip_name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{trip.trip_name}</h5>
                                    <p className="card-text text-muted">Precio: ${trip.total_cost}</p>
                                    <p className="card-text">{trip.description}</p>
                                </div>
                                <div className="card-footer text-center">
                                    <a href="#" className="btn btn-primary">
                                        ¡Lo quiero!
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};