import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, ListGroup } from 'react-bootstrap';

const EditActivityModal = ({ activity, show, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 0,
        difficulty: '',
        min_participants: 0,
        max_participants: 0,
        cost: 0,
        activity_image_url: '',
        is_available: true,
        is_public: true,
        category_id: '',
        location_id: ''
    });

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [locationSearch, setLocationSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        // Cargar datos de la actividad cuando se abre el modal
        if (activity) {
            console.log("Actividad a editar:", activity); // Depurar datos recibidos
            
            setFormData({
                id: activity.id,
                name: activity.name || '',
                description: activity.description || '',
                duration: activity.duration || 0,
                difficulty: activity.difficulty || '',
                min_participants: activity.min_participants || 0,
                max_participants: activity.max_participants || 0,
                cost: activity.cost || 0,
                activity_image_url: activity.activity_image_url || '',
                is_available: activity.is_available !== undefined ? activity.is_available : true,
                is_public: activity.is_public !== undefined ? activity.is_public : true,
                category_id: activity.category_id || '',
                location_id: activity.location_id || ''
            });

            // Si hay un location_id, buscar los detalles de esa ubicación
            if (activity.location_id) {
                console.log("Buscando ubicación con ID:", activity.location_id);
                fetchLocationDetails(activity.location_id);
            }
        }
    }, [activity]);

    const fetchLocationDetails = async (locationId) => {
        try {
            console.log(`Buscando ubicación con ID: ${locationId}`);
            
            // Intentamos obtener todas las ubicaciones primero
            const response = await fetch(`https://rangerhub-back.vercel.app/locations?per_page=100`);
            if (response.ok) {
                const data = await response.json();
                console.log(`Recibidas ${data.locations ? data.locations.length : 0} ubicaciones`);
                
                if (data.locations && data.locations.length > 0) {
                    // Convertimos IDs a string para asegurar una comparación correcta
                    const stringLocationId = String(locationId);
                    const exactLocation = data.locations.find(loc => String(loc.id) === stringLocationId);
                    
                    if (exactLocation) {
                        console.log(`Ubicación encontrada:`, exactLocation);
                        setSelectedLocation(exactLocation);
                        return;
                    } else {
                        console.log(`No se encontró ubicación exacta con ID: ${locationId}`);
                        
                        // Si no encontramos la ubicación exacta, intentamos con búsqueda específica
                        const searchResponse = await fetch(`https://rangerhub-back.vercel.app/locations?search=${encodeURIComponent(locationId)}`);
                        if (searchResponse.ok) {
                            const searchData = await searchResponse.json();
                            if (searchData.locations && searchData.locations.length > 0) {
                                console.log(`Se encontró ubicación mediante búsqueda:`, searchData.locations[0]);
                                setSelectedLocation(searchData.locations[0]);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error al obtener detalles de la ubicación:', error);
        }
    };

    useEffect(() => {
        // Cargar categorías si es necesario
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                console.log("Solicitando categorías...");
                const response = await fetch('https://rangerhub-back.vercel.app/activitycategory');

                // Verificar respuesta HTTP
                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
                }

                // Convertir respuesta a JSON con manejo de errores
                const rawData = await response.text();
                console.log("Respuesta de categorías (raw):", rawData);

                let data;
                try {
                    data = JSON.parse(rawData);
                } catch (parseError) {
                    console.error("Error al parsear JSON:", parseError);
                    throw new Error("La respuesta no es un JSON válido");
                }

                // Verificar estructura de datos
                console.log("Datos de categorías:", data);

                if (!data || typeof data !== 'object') {
                    throw new Error("La respuesta no tiene el formato esperado");
                }

                // Determinar dónde están las categorías en la respuesta
                let categoriesToUse = [];

                if (Array.isArray(data)) {
                    // Si la respuesta es directamente un array
                    categoriesToUse = data;
                } else if (data.categories && Array.isArray(data.categories)) {
                    // Si la respuesta tiene una propiedad 'categories'
                    categoriesToUse = data.categories;
                } else if (data.data && Array.isArray(data.data)) {
                    // Si la respuesta tiene una propiedad 'data'
                    categoriesToUse = data.data;
                } else {
                    // Buscar cualquier array en la respuesta
                    const possibleArrayProps = Object.keys(data).find(key => Array.isArray(data[key]));
                    if (possibleArrayProps) {
                        categoriesToUse = data[possibleArrayProps];
                    }
                }

                console.log(`Se encontraron ${categoriesToUse.length} categorías:`, categoriesToUse);
                setCategories(categoriesToUse);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
                // Mostrar un mensaje de error al usuario
                alert(`Error al cargar categorías: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        // Llamar a la función si el modal está visible
        if (show) {
            fetchCategories();
        }
    }, [show]);

    // Búsqueda de ubicaciones
    useEffect(() => {
        const searchLocations = async () => {
            if (locationSearch.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(`https://rangerhub-back.vercel.app/locations?search=${encodeURIComponent(locationSearch)}&per_page=5`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.locations || []);
                }
            } catch (error) {
                console.error('Error al buscar ubicaciones:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        // Usar un debounce para no hacer demasiadas solicitudes
        const timeoutId = setTimeout(() => {
            searchLocations();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [locationSearch]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Manejar diferentes tipos de inputs
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'category_id') {
            // Para las categorías, asegurarnos de que se maneje correctamente
            console.log(`Categoría seleccionada: ID=${value}`);
            setFormData(prev => ({ ...prev, [name]: value }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setFormData(prev => ({ ...prev, location_id: location.id }));
        setLocationSearch('');
        setSearchResults([]);
    };

    const clearSelectedLocation = () => {
        setSelectedLocation(null);
        setFormData(prev => ({ ...prev, location_id: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar Actividad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Duración (horas)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Dificultad</Form.Label>
                                    <Form.Select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Fácil">Fácil</option>
                                        <option value="Intermedia">Intermedia</option>
                                        <option value="Difícil">Difícil</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Mínimo de participantes</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="min_participants"
                                        value={formData.min_participants}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Máximo de participantes</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="max_participants"
                                        value={formData.max_participants}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Costo ($)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                name="cost"
                                value={formData.cost}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>URL de imagen</Form.Label>
                            <Form.Control
                                type="text"
                                name="activity_image_url"
                                value={formData.activity_image_url}
                                onChange={handleInputChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            {categories.length > 0 ? (
                                <Form.Select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar categoría...</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        type="text"
                                        disabled
                                        placeholder="Cargando categorías..." 
                                    />
                                    <div className="spinner-border spinner-border-sm ms-2" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            )}
                        </Form.Group>
                        
                        {/* Barra de búsqueda de ubicaciones */}
                        <Form.Group className="mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            {selectedLocation ? (
                                <div className="d-flex align-items-center mb-2 p-2 border rounded">
                                    <div className="flex-grow-1">
                                        <div><strong>{selectedLocation.place_name}</strong></div>
                                        <div className="text-muted small">{selectedLocation.province}, {selectedLocation.country}</div>
                                    </div>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={clearSelectedLocation}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar ubicación..."
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                        />
                                        {isSearching && (
                                            <InputGroup.Text>
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Buscando...</span>
                                                </div>
                                            </InputGroup.Text>
                                        )}
                                    </InputGroup>
                                    
                                    {searchResults.length > 0 && (
                                        <ListGroup className="mt-2 position-relative">
                                            {searchResults.map(location => (
                                                <ListGroup.Item 
                                                    key={location.id} 
                                                    action 
                                                    onClick={() => handleLocationSelect(location)}
                                                    className="py-2"
                                                >
                                                    <div><strong>{location.place_name}</strong></div>
                                                    <div className="text-muted small">{location.province}, {location.country}</div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </>
                            )}
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Disponible"
                                name="is_available"
                                checked={formData.is_available}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Público"
                                name="is_public"
                                checked={formData.is_public}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditActivityModal;