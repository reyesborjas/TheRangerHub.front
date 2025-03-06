import { useEffect, useState } from "react";
import "../../styles/Activities.css";
import EditActivityModal from "./EditActivityModal";
import TopNavbar from "../../components/TopNavbar";

export const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

    // Estado para el modal de edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentActivityToEdit, setCurrentActivityToEdit] = useState(null);

    useEffect(() => {
        fetch("https://rangerhub-back.vercel.app/activities")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener actividades");
                }
                return response.json();
            })
            .then((data) => {
                setActivities(data.activities || []);
            })
            .catch((err) => {
                console.error(err);
                setError("No se pudieron cargar las actividades");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const filteredActivities = activities.filter(
        (activity) =>
            activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (activity.description &&
                activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getDifficultyClass = (difficulty) => {
        if (!difficulty) return "";
        const diff = difficulty.toLowerCase();
        if (diff.includes("fácil") || diff.includes("facil")) {
            return "text-success fw-bold";
        } else if (diff.includes("intermedia") || diff.includes("medio")) {
            return "text-warning fw-bold";
        } else if (diff.includes("difícil") || diff.includes("dificil")) {
            return "text-danger fw-bold";
        }
        return "";
    };

    const handleEdit = (activityId) => {
        const activityToEdit = activities.find(activity => activity.id === activityId);
        if (activityToEdit) {
            setCurrentActivityToEdit(activityToEdit);
            setShowEditModal(true);
        } else {
            console.error("No se encontró la actividad con ID:", activityId);
        }
    };
    
    const handleDelete = (activityId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
            fetch(`https://rangerhub-back.vercel.app/activities/${activityId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.message || "Error al eliminar la actividad");
                        });
                    }
                    return response.json();
                })
                .then(() => {
                    setActivities(activities.filter(activity => activity.id !== activityId));
                    alert("Actividad eliminada con éxito");
                })
                .catch(error => {
                    console.error("Error al eliminar actividad:", error);
                    alert(error.message || "Hubo un error al eliminar la actividad");
                });
        }
    };
    return (
        <div className="my-trips-container container">
            <TopNavbar />
            <h1 className="text-center my-4">Actividades que Tenemos para Ofrecer</h1>
            <div className="col-md-6">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar actividad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-search" type="button">Buscar</button>
                </div>
            </div>
            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
            {
                isLoading ? (
                    <div className="d-flex justify-content-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : filteredActivities.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {filteredActivities.map((activity, index) => (
                            <div className="col" key={activity.id || index}>
                                <div className="activity-card new-layout">
                                    <div className="activity-image-container">
                                        {activity.activity_image_url ? (
                                            <img
                                                src={activity.activity_image_url}
                                                alt={activity.name}
                                                className="img-fluid cover-img"
                                            />
                                        ) : (
                                            <div className="no-image">Sin imagen</div>
                                        )}
                                    </div>

                                    {/* Botones de edición y eliminación, visibles para Rangers */}
                                    {currentUser && currentUser.role_name === "Ranger" && (
                                        <>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(activity.id)}
                                                title="Editar actividad"
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(activity.id)}
                                                title="Eliminar actividad"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </>
                                    )}


                                    <div className="activity-content">
                                        <div className="activity-header">
                                            <h3 className="activity-title">{activity.name}</h3>
                                        </div>
                                        <div className="activity-details">
                                            <div className="difficulty-section">
                                                <span className={`activity-difficulty ${getDifficultyClass(activity.difficulty)}`}>
                                                    Dificultad: {activity.difficulty || "N/A"}
                                                </span>
                                            </div>
                                            <div className="cost-section">
                                                <span className="activity-cost">Costo: ${activity.cost || "0"}</span>
                                            </div>
                                        </div>
                                        <hr className="divider" />
                                        <div className="description-section">
                                            <p className="activity-description">{activity.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center my-5">
                        <h3>No se encontraron actividades con ese criterio de búsqueda.</h3>
                    </div>
                )
            }
            {/* Modal de edición */}
            {showEditModal && (
                <EditActivityModal
                    trip={currentActivityToEdit}
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setCurrentActivityToEdit(null);
                    }}
                    onSave={handleActivityUpdate}
                />
            )}
        </div >
    );
};