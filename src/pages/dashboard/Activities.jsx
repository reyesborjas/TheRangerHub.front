import { useEffect, useState } from "react";
import "../../styles/Activities.css";


export const Activities = () => {
  let [activities, setActivities] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://rangerhub-back.vercel.app/activities")
      .then((response) => {
        return response.json();
      })
      .then((responseConverted) => {
        setActivities(responseConverted.activities);
      })
      .catch((error) => console.log(error));
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div>
      <h2>Mira todas las Actividades que tenemos para ofrecer</h2>
      <input
  type="text"
  placeholder="Buscar actividad..."
  className="form-control mb-3"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      <div className="container">
        <div className="row">
  {activities.length > 0 &&
    (filteredActivities.length > 0 ? (
      filteredActivities.map((activity) => (
        <div className="col-4" key={activity.id}>
          <div className="card">
            <img src={activity.activity_image_url} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{activity.name}</h5>
              <p className="card-text">
                {activity.description}
              </p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Dificultad: {activity.difficulty}</li>
              <li className="list-group-item">Costo: ${activity.cost}</li>
            </ul>
            {/* <div className="card-body">
              <a href="#" className="card-link">
                Card link
              </a>
              <a href="#" className="card-link">
                Another link
              </a>
            </div> */}
          </div>
        </div>
      ))
    ) : (
      <p>No activities found</p>
    ))}
        </div>
      </div>
    </div>
  );
};
