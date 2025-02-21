import { useEffect, useState } from "react";

export const Trips = () => {
  let [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("")
      .then((response) => {
        return response.json();
      })
      .then((responseConverted) => {
        console.log(responseConverted);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h1>Página de viajes</h1>
    </div>
  );
};
