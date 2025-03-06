import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditActivityModal = ({ activity, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "",
    cost: "",
    duration: "",
    min_participants: "",
    max_participants: "",
    activity_image_url: "",
    is_available: true,
    is_public: true,
    category_id: "",
    location_id: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || "",
        description: activity.description || "",
        difficulty: activity.difficulty || "",
        cost: activity.cost || "",
        duration: activity.duration || "",
        min_participants: activity.min_participants || "",
        max_participants: activity.max_participants || "",
        activity_image_url: activity.activity_image_url || "",
        is_available: activity.is_available !== false,
        is_public: activity.is_public !== false,
        category_id: activity.category_id || "",
        location_id: activity.location_id || ""
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `https://rangerhub-back.vercel.app/activities/${activity.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            cost: parseFloat(formData.cost),
            duration: parseFloat(formData.duration),
            min_participants: parseInt(formData.min_participants, 10),
            max_participants: parseInt(formData.max_participants, 10)
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la actividad");
      }

      const data = await response.json();
      onSave({ ...activity, ...formData, id: activity.id });
    } catch (error) {
      setError(error.message || "Hubo un error al actualizar la actividad");
      console.error("Error en la actualización:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Actividad: {activity?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Dificultad</Form.Label>
              <Form.Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="">Seleccionar dificultad</option>
                <option value="Fácil">Fácil</option>
                <option value="Intermedia">Intermedia</option>
                <option value="Difícil">Difícil</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Costo ($)</Form.Label>
              <Form.Control
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Duración (horas)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="0"
                step="0.5"
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Mínimo de participantes</Form.Label>
              <Form.Control
                type="number"
                name="min_participants"
                value={formData.min_participants}
                onChange={handleChange}
                required
                min="1"
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Máximo de participantes</Form.Label>
              <Form.Control
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                required
                min="1"
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>URL de la imagen</Form.Label>
            <Form.Control
              type="text"
              name="activity_image_url"
              value={formData.activity_image_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </Form.Group>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Check
                type="checkbox"
                label="Disponible"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Check
                type="checkbox"
                label="Público"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditActivityModal;