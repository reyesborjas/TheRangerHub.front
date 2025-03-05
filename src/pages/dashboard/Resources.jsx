import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Resources.css"

export const Resources = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    cost: 0
  });
  const [addForm, setAddForm] = useState({
    name: "",
    description: '{"estado": "", "marca": "", "tipo": ""}',
    cost: 0
  });
  const navigate = useNavigate();

  // Obtener nombre de usuario desde localStorage o contexto si está disponible
  const username = localStorage.getItem("username") || "user";

  // Auto-ocultar mensaje de éxito después de 5 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchResources = () => {
    setIsLoading(true);
    // Obtener recursos desde la API
    fetch("https://rangerhub-back.vercel.app/resources")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron obtener los recursos`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Resources data:", data);
        setResources(data.resources || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        if (error.response && error.response.status === 409) {
          // Mostrar mensaje específico sobre el recurso en uso
          setError(`No se puede eliminar: ${error.response.data.message}`);
        } else {
          setError('Error al cargar los recursos');
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Formatear costo como moneda
  const formatCost = (cost) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP' 
    }).format(cost);
  };

  // Formatear descripción JSON (si es una cadena, analizarla; si ya es un objeto, usarlo)
  const formatDescription = (description) => {
    try {
      // Si la descripción es una cadena, intentar analizarla como JSON
      const descObj = typeof description === 'string' 
        ? JSON.parse(description) 
        : description;

      // Si es un objeto simple, mostrar pares clave-valor
      if (descObj && typeof descObj === 'object') {
        return (
          <div>
            {Object.entries(descObj).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
              </div>
            ))}
          </div>
        );
      }

      // Alternativa si no está en el formato esperado
      return description;
      
    } catch (error) {
      // Si el análisis falla, devolver la cadena original
      return description;
    }
  };

  // Manejar clic en botón de eliminar
  const handleDeleteClick = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteModal(true);
  };

  // Manejar clic en botón de editar
  const handleEditClick = (resource) => {
    setResourceToEdit(resource);

    // Preparar formulario de edición con valores actuales
    const descriptionStr = typeof resource.description === 'object' 
      ? JSON.stringify(resource.description) 
      : resource.description;
      
    setEditForm({
      name: resource.name,
      description: descriptionStr,
      cost: resource.cost
    });
    setShowEditModal(true);
  };

  // Manejar clic en botón Agregar
  const handleAddClick = () => {
    setAddForm({
      name: "",
      description: '{"estado": "", "marca": "", "tipo": ""}',
      cost: 0
    });
    setShowAddModal(true);
  };

  // Manejar confirmación de eliminación
  const handleConfirmDelete = () => {
    if (!resourceToDelete) return;
    
    setIsLoading(true);
    // Llamar a la API para eliminar recurso
    fetch(`https://rangerhub-back.vercel.app/resources/${resourceToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          if (response.status === 409) {
            setShowDeleteModal(false);
            setError(data.message || "Este recurso está en uso y no puede ser eliminado.");
            setIsLoading(false);
            return;
          }
          throw new Error(data.message || 'Error al eliminar el recurso');
        }
        

        setShowDeleteModal(false);
        setError(null);
        setSuccess(`Recurso "${resourceToDelete.name}" eliminado correctamente`);
        // Refresh resources
        fetchResources();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message || 'Error al eliminar el recurso');
      setShowDeleteModal(false);
      setIsLoading(false);
    });
  };

  // Manejar cambio en formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  // Manejar cambio en formulario de agregar
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm({
      ...addForm,
      [name]: value
    });
  };

  // Manejar envío de edición
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!resourceToEdit) return;

    // Analizar descripción como JSON si es posible
    let parsedDescription;
    try {
      parsedDescription = JSON.parse(editForm.description);
    } catch {
      parsedDescription = editForm.description;
    }
    
    const updatedResource = {
      ...editForm,
      description: parsedDescription
    };
    
    setIsLoading(true);
    // Call API to update resource
    fetch(`https://rangerhub-back.vercel.app/resources/${resourceToEdit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedResource)
    })
    .then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          throw new Error(data.message || 'Error al actualizar el recurso');
        }
        setError(null);
        setSuccess(`Recurso "${editForm.name}" actualizado correctamente`);
        fetchResources();
        setShowEditModal(false);
      });
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message || 'Error al actualizar el recurso');
      setIsLoading(false);
    });
  };

  // Manejar envío de agregar
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    let parsedDescription;
    try {
      parsedDescription = JSON.parse(addForm.description);
    } catch {
      parsedDescription = addForm.description;
    }
    
    const newResource = {
      ...addForm,
      description: parsedDescription
    };
    
    setIsLoading(true);
    // Llamar a la API para crear recurso
    fetch("https://rangerhub-back.vercel.app/resources", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResource)
    })
    .then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          throw new Error(data.message || 'Error al crear el recurso');
        }
        setError(null);
        setSuccess(`Recurso "${addForm.name}" creado correctamente`);
        fetchResources();
        setShowAddModal(false);
      });
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message || 'Error al crear el recurso');
      setIsLoading(false);
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Recursos Disponibles</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-success" 
          onClick={handleAddClick}
        >
          <i className="bi bi-plus-circle me-1"></i> Agregar Recurso
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12">
            <div className="card resources-card">
              <div className="card-body">
                <h5 className="card-title">Lista de Recursos</h5>
                {resources.length === 0 ? (
                  <p className="text-center">No hay recursos disponibles</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Costo</th>
                          <th style={{ width: "80px" }} className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((resource) => (
                          <tr key={resource.id}>
                            <td>{resource.name}</td>
                            <td>{formatDescription(resource.description)}</td>
                            <td>{formatCost(resource.cost)}</td>
                            <td className="text-end">
                              <i 
                                className="bi bi-pencil text-primary me-2"
                                style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={() => handleEditClick(resource)}
                                title="Editar recurso"
                              ></i>
                              <i 
                                className="bi bi-trash text-danger" 
                                style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={() => handleDeleteClick(resource)}
                                title="Eliminar recurso"
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button 
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => navigate(`/secured/${username}/dashboard/home`)}
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar el recurso "{resourceToDelete?.name}"?</p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Recurso */}
      {showEditModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Recurso</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitEdit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción (JSON)</label>
                    <textarea 
                      className="form-control" 
                      id="description" 
                      name="description"
                      value={editForm.description}
                      onChange={handleEditFormChange}
                      rows="5"
                      required
                    ></textarea>
                    <small className="form-text text-muted">
                      Ingrese la descripción en formato JSON. Ejemplo: {"{"}"estado": "Nuevo", "marca": "Sony", "tipo": "Electrónico"{"}"}
                    </small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cost" className="form-label">Costo</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="cost" 
                      name="cost"
                      value={editForm.cost}
                      onChange={handleEditFormChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="modal-footer p-0 pt-3">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Recurso */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Recurso</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitAdd}>
                  <div className="mb-3">
                    <label htmlFor="add-name" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="add-name" 
                      name="name"
                      value={addForm.name}
                      onChange={handleAddFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="add-description" className="form-label">Descripción (JSON)</label>
                    <textarea 
                      className="form-control" 
                      id="add-description" 
                      name="description"
                      value={addForm.description}
                      onChange={handleAddFormChange}
                      rows="5"
                      required
                    ></textarea>
                    <small className="form-text text-muted">
                      Ingrese la descripción en formato JSON. Ejemplo: {"{"}"estado": "Nuevo", "marca": "Sony", "tipo": "Electrónico"{"}"}
                    </small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="add-cost" className="form-label">Costo</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="add-cost" 
                      name="cost"
                      value={addForm.cost}
                      onChange={handleAddFormChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="modal-footer p-0 pt-3" style={{backgroundColor:"white", borderColor:"white"}}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-success"
                    >
                      Crear Recurso
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};