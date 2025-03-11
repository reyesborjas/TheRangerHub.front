import React, { useState, useEffect } from 'react';
import "../../styles/Comentarios.css";
import axios from 'axios';

const Comentarios = () => {
  // Estados para la aplicación
  const [viajesUsuario, setViajesUsuario] = useState([]);
  const [comentariosPorViaje, setComentariosPorViaje] = useState({});
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState({
    calification: 0,
    user_comment: ''
  });
  const [mensajeExito, setMensajeExito] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  
  const API_URL = 'https://rangerhub-back.vercel.app';
  
  // Obtener datos del usuario actual - CORREGIDO PARA USAR currentUser
  const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = userData?.id;
  const userRole = userData?.role_name;
  const isExplorer = userRole === 'Explorer';
  const isRanger = userRole === 'Ranger';
  
  console.log("Datos de usuario parseados:", { userId, userRole, isExplorer, isRanger });
  
  // Verificar que el componente se monta correctamente
  useEffect(() => {
    console.log("Componente Comentarios montado");
  }, []);
  
  // Función para cargar las reservaciones del usuario
  useEffect(() => {
    const obtenerViajesUsuario = async () => {
      console.log("Ejecutando obtenerViajesUsuario, userId:", userId, "rol:", userRole);
      
      if (!userId) {
        console.log("No hay userId, abortando");
        setCargando(false);
        setError('Debes iniciar sesión para ver tus viajes');
        return;
      }
      
      try {
        setCargando(true);
        
        if (isExplorer) {
          console.log("Usuario es Explorer, obteniendo reservaciones");
          // Si es Explorer, obtener sus reservaciones
          const url = `${API_URL}/reservations/user/${userId}`;
          console.log('Consultando reservaciones, URL:', url);
          
          const token = localStorage.getItem('token');
          const response = await axios.get(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          
          console.log('Respuesta de reservaciones:', response.data);
          
          if (response.data?.reservations && Array.isArray(response.data.reservations)) {
            console.log("Reservaciones encontradas:", response.data.reservations.length);
            setViajesUsuario(response.data.reservations);
            
            if (response.data.reservations.length > 0) {
              const primerViajeId = response.data.reservations[0].trip_id;
              console.log("Seleccionando primer viaje:", primerViajeId);
              setViajeSeleccionado(primerViajeId);
            } else {
              console.log("No hay reservaciones para mostrar");
            }
          } else {
            console.log("Formato de respuesta incorrecto o no hay reservaciones");
            setViajesUsuario([]);
          }
        } else if (isRanger) {
          console.log("Usuario es Ranger, obteniendo viajes liderados");
          const url = `${API_URL}/trips/ranger/${userId}`;
          console.log('Consultando viajes del ranger, URL:', url);
          
          const token = localStorage.getItem('token');
          const response = await axios.get(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          
          console.log('Respuesta de viajes del ranger:', response.data);
          
          if (response.data?.trips && Array.isArray(response.data.trips)) {
            console.log("Viajes encontrados:", response.data.trips.length);
            setViajesUsuario(response.data.trips);
            
            if (response.data.trips.length > 0) {
              const primerViajeId = response.data.trips[0].id;
              console.log("Seleccionando primer viaje:", primerViajeId);
              setViajeSeleccionado(primerViajeId);
            } else {
              console.log("No hay viajes para mostrar");
            }
          } else {
            console.log("Formato de respuesta incorrecto o no hay viajes");
            setViajesUsuario([]);
          }
        } else {
          console.log("Rol no reconocido:", userRole);
        }
        
        setError('');
      } catch (err) {
        console.error('Error al obtener viajes del usuario:', err);
        setError('No se pudieron cargar tus viajes. Por favor, intenta más tarde.');
      } finally {
        setCargando(false);
      }
    };
    
    obtenerViajesUsuario();
  }, [userId, isExplorer, isRanger]);
  
  // Cargar comentarios cuando se selecciona un viaje
  useEffect(() => {
    const obtenerComentarios = async () => {
      if (!viajeSeleccionado) {
        console.log("No hay viaje seleccionado, no se cargan comentarios");
        return;
      }
      
      try {
        console.log('Cargando comentarios para el viaje:', viajeSeleccionado);
        const url = `${API_URL}/api/trips/${viajeSeleccionado}/califications`;
        console.log('URL de comentarios:', url);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        console.log('Respuesta de comentarios:', response.data);
        
        // Guardar los comentarios en el estado por viaje
        setComentariosPorViaje(prev => ({
          ...prev,
          [viajeSeleccionado]: response.data
        }));
      } catch (err) {
        console.error('Error al obtener comentarios:', err);
        console.error('Detalles del error:', err.response ? err.response.data : err.message);
        
        // Inicializar con array vacío en caso de error
        setComentariosPorViaje(prev => ({
          ...prev,
          [viajeSeleccionado]: []
        }));
      }
    };
    
    obtenerComentarios();
  }, [viajeSeleccionado]);
  
  // Verificar si el usuario ya ha calificado el viaje seleccionado
  const yaCalificoViaje = () => {
    if (!viajeSeleccionado || !userId) return true;
    
    const comentariosViaje = comentariosPorViaje[viajeSeleccionado] || [];
    console.log("Verificando si usuario ya calificó:", { 
      userId, 
      comentariosCount: comentariosViaje.length,
      comentarios: comentariosViaje 
    });
    
    return comentariosViaje.some(cal => cal.user_id === userId);
  };
  
  // Manejador para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoComentario(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejador para selección de estrellas
  const handleEstrellas = (valor) => {
    setNuevoComentario(prev => ({
      ...prev,
      calification: valor
    }));
  };
  
  // Manejador para selección de viaje
  const handleSeleccionViaje = (e) => {
    const nuevoViajeId = e.target.value;
    console.log("Viaje seleccionado:", nuevoViajeId);
    setViajeSeleccionado(nuevoViajeId);
  };
  
  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!viajeSeleccionado) {
      setError('No hay viaje seleccionado');
      return;
    }
    
    // Validación básica
    if (nuevoComentario.calification === 0 || !nuevoComentario.user_comment) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      console.log('Enviando calificación:', {
        trip_id: viajeSeleccionado,
        user_id: userId,
        calification: nuevoComentario.calification,
        user_comment: nuevoComentario.user_comment
      });
      
      const url = `${API_URL}/api/califications`;
      const token = localStorage.getItem('token');
      
      const response = await axios.post(url, 
        {
          trip_id: viajeSeleccionado,
          user_id: userId,
          calification: nuevoComentario.calification,
          user_comment: nuevoComentario.user_comment
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      console.log('Respuesta al crear calificación:', response.data);
      
      // Actualizar lista de comentarios
      const comentariosUrl = `${API_URL}/api/trips/${viajeSeleccionado}/califications`;
      const comentariosResponse = await axios.get(comentariosUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Actualizar los comentarios para este viaje
      setComentariosPorViaje(prev => ({
        ...prev,
        [viajeSeleccionado]: comentariosResponse.data
      }));
      
      // Reiniciar el formulario
      setNuevoComentario({
        calification: 0,
        user_comment: ''
      });
      
      // Mostrar mensaje de éxito
      setMensajeExito(true);
      setError('');
      setTimeout(() => setMensajeExito(false), 3000);
      
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      
      if (err.response) {
        if (err.response.status === 409) {
          setError('Ya has calificado este viaje anteriormente');
        } else {
          setError(`Error: ${err.response.data?.error || 'No se pudo enviar tu comentario'}`);
        }
      } else {
        setError('No se pudo enviar tu comentario. Por favor, intenta más tarde.');
      }
    }
  };
  
  // Formatear fecha para mostrar
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fechaISO;
    }
  };
  
  // Componente para mostrar las estrellas
  const Estrellas = ({ cantidad, onSeleccion = null }) => {
    return (
      <div className="estrellas">
        {[1, 2, 3, 4, 5].map(num => (
          <span 
            key={num}
            className={`estrella ${num <= cantidad ? 'activa' : ''}`}
            onClick={() => onSeleccion && onSeleccion(num)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  const comentariosViaje = viajeSeleccionado ? (comentariosPorViaje[viajeSeleccionado] || []) : [];
  console.log("Estado actual:", {
    viajeSeleccionado,
    hayViajes: viajesUsuario.length > 0,
    comentariosViaje: comentariosViaje.length,
    puedeCalificar: isExplorer && !yaCalificoViaje()
  });
  
  return (
    <div className="seccion-comentarios">
      <h2 className="titulo">Opiniones de Aventureros</h2>
      
      {/* Mensaje de error */}
      {error && <div className="mensaje-error">{error}</div>}
      
      {/* Selector de viaje */}
      {viajesUsuario.length > 0 ? (
        <div className="selector-viaje">
          <label>Selecciona un viaje:</label>
          <select 
            value={viajeSeleccionado || ''} 
            onChange={handleSeleccionViaje}
            className="selector-desplegable"
          >
            <option value="">Selecciona...</option>
            {viajesUsuario.map(viaje => (
              <option 
                key={viaje.id || viaje.trip_id} 
                value={viaje.id || viaje.trip_id}
              >
                {viaje.trip_name || `Viaje del ${formatearFecha(viaje.created_at)}`}
              </option>
            ))}
          </select>
        </div>
      ) : !cargando ? (
        <p className="sin-viajes">No tienes viajes registrados.</p>
      ) : null}
      
      {/* Indicador de carga */}
      {cargando ? (
        <div className="cargando">Cargando información...</div>
      ) : viajeSeleccionado ? (
        <>
          {/* Lista de comentarios para el viaje seleccionado */}
          <div className="lista-comentarios">
            <h3>Comentarios para este viaje</h3>
            {comentariosViaje.length > 0 ? (
              comentariosViaje.map(comentario => (
                <div key={comentario.id} className="comentario">
                  <div className="comentario-cabecera">
                    <div>
                      <p className="nombre-usuario">{comentario.user_name}</p>
                      <Estrellas cantidad={comentario.calification} />
                    </div>
                    <p className="fecha">{formatearFecha(comentario.created_at)}</p>
                  </div>
                  <p className="texto-comentario">{comentario.user_comment}</p>
                </div>
              ))
            ) : (
              <p className="sin-comentarios">Todavía no hay opiniones para este viaje.</p>
            )}
          </div>
          
          {/* Formulario para añadir comentario - SOLO PARA EXPLORERS QUE NO HAN CALIFICADO */}
          {isExplorer && !yaCalificoViaje() && (
            <div className="formulario-container">
              <h3 className="subtitulo">Comparte tu experiencia</h3>
              
              {mensajeExito && (
                <div className="mensaje-exito">
                  ¡Gracias por tu opinión! Tu comentario ayudará a otros aventureros.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="campo-formulario">
                  <label>Calificación</label>
                  <Estrellas 
                    cantidad={nuevoComentario.calification} 
                    onSeleccion={handleEstrellas} 
                  />
                </div>
                
                <div className="campo-formulario">
                  <label>Tu opinión</label>
                  <textarea 
                    name="user_comment" 
                    value={nuevoComentario.user_comment} 
                    onChange={handleChange}
                    rows="4"
                    placeholder="Comparte tu experiencia de esta aventura..."
                  />
                </div>
                
                <button type="submit" className="boton-enviar">
                  Enviar Opinión
                </button>
              </form>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Comentarios;