import { useEffect, useState } from "react";

export const Activities = () => {
  let [activities, setActivities] = useState([]);

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

  return (
    <div>
      <h1>Página de Actividades</h1>
      <div className="container">
        <div className="row">
          {activities.length > 0 &&
            activities.map((activity) => {
              return (
                <div className="col-4">
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
              );
            })}
        </div>
      </div>
    </div>
  );
};
