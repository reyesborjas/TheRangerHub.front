import { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar.jsx";
import "../../styles/Activities.css";

export const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("https://rangerhub-back.vercel.app/activities")
            .then((response) => response.json())
            .then((data) => setActivities(data.activities))
            .catch((error) => console.log(error));
    }, []);

    const filteredActivities = activities.filter((activity) =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const getDifficultyClass = (difficulty) => {
        const diff = difficulty.toLowerCase();
        if (diff === "fácil" || diff === "facil") return "text-success";
        if (diff === "intermedio") return "text-warning";
        if (diff === "difícil" || diff === "dificil") return "text-danger";
        return "";
    };

    return (
        <div>
            <TopNavbar />
            <div className="activities-container container my-5">
                <h1 className="text-center mb-4">Explora Nuestras Actividades</h1>

                {/* Contenedor de la barra de búsqueda */}
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Buscar actividad..."
                        className="form-control search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grid responsivo de tarjetas */}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity) => (
                            <div className="col" key={activity.id}>
                                <div className="card h-100 activity-card shadow-sm">
                                    <img
                                        src={activity.activity_image_url}
                                        className="card-img-top activity-img"
                                        alt={activity.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{activity.name}</h5>
                                        <p className="card-text">{activity.description}</p>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            Dificultad:{" "}
                                            <span className={getDifficultyClass(activity.difficulty)}>
                        {activity.difficulty}
                      </span>
                                        </li>
                                        <li className="list-group-item">Costo: ${activity.cost}</li>
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No se encontraron actividades.</p>
                    )}
                </div>
            </div>
        </div>
    );
};