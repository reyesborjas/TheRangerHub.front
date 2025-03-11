import React, { useState, useEffect } from 'react';
import "../../styles/CalificacionRanger.css";
import axios from 'axios';

const Comentarios = () => {
  // Estados para la aplicación
  const [viajesUsuario, setViajesUsuario] = useState([]);
  const [todosLosViajes, setTodosLosViajes] = useState([]); // Para almacenar todos los viajes con nombres
  const [calificacionesPorViaje, setCalificacionesPorViaje] = useState({});
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [nuevaCalificacion, setNuevaCalificacion] = useState({
    calification: 0,
    user_comment: ''
  });
  const [mensajeExito, setMensajeExito] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  
  const API_URL = 'https://rangerhub-back.vercel.app';
  
  // Obtener datos del usuario actual
  const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = userData?.id;
  const userRole = userData?.role_name;
  const isExplorer = userRole === 'Explorer';
  
  console.log("Datos de usuario:", userData);
  
  // Verificar que el componente se monta correctamente
  useEffect(() => {
    console.log("Componente Comentarios montado");
  }, []);
  
  // Primero cargar todos los viajes para obtener sus nombres
  useEffect(() => {
    const obtenerTodosLosViajes = async () => {
      if (!userId) return; // No continuar si no hay usuario
      
      try {
        // Intentar obtener la lista completa de viajes
        const url = `${API_URL}/trips`;
        console.log('Consultando lista de viajes, URL:', url);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (response.data?.trips && Array.isArray(response.data.trips)) {
          console.log("Viajes totales obtenidos:", response.data.trips.length);
          // Crear un mapa de id -> nombre para búsqueda rápida
          const viajesMap = response.data.trips.reduce((map, viaje) => {
            map[viaje.id] = viaje.trip_name || `Viaje ${viaje.id.substring(0, 8)}`;
            return map;
          }, {});
          
          setTodosLosViajes(viajesMap);
        } else {
          console.log("No se pudieron obtener todos los viajes o formato incorrecto");
        }
      } catch (err) {
        console.error("Error al obtener todos los viajes:", err);
      }
    };
    
    obtenerTodosLosViajes();
  }, [userId]);
  
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
      
      if (!isExplorer) {
        console.log("Usuario no es Explorer, abortando");
        setCargando(false);
        setError('Solo los Explorers pueden calificar a los Rangers');
        return;
      }
      
      try {
        setCargando(true);
        
        // Obtener las reservaciones del usuario
        const url = `${API_URL}/reservations/user/${userId}`;
        console.log('Consultando reservaciones, URL:', url);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        console.log('Respuesta de reservaciones:', response.data);
        
        if (response.data?.reservations && Array.isArray(response.data.reservations)) {
          console.log("Reservaciones encontradas:", response.data.reservations.length);
          
          // Procesar las reservaciones y asignar nombres desde la lista de todos los viajes
          const viajes = response.data.reservations.map(reserva => {
            const tripId = reserva.trip_id;
            let nombreViaje = "Viaje sin nombre";
            
            // Buscar el nombre en el mapa de todos los viajes
            if (todosLosViajes[tripId]) {
              nombreViaje = todosLosViajes[tripId];
              console.log(`Encontrado nombre para viaje ${tripId}: "${nombreViaje}"`);
            } else {
              // Si no está en el mapa, usar fecha o ID
              nombreViaje = `Viaje del ${formatearFecha(reserva.created_at) || tripId.substring(0, 8)}`;
              console.log(`No se encontró nombre para viaje ${tripId}, usando "${nombreViaje}"`);
            }
            
            return {
              id: tripId,
              trip_id: tripId,
              trip_name: nombreViaje,
              created_at: reserva.created_at
            };
          });
          
          console.log("Viajes procesados:", viajes);
          setViajesUsuario(viajes);
          
          if (viajes.length > 0) {
            const primerViajeId = viajes[0].trip_id;
            console.log("Seleccionando primer viaje:", primerViajeId);
            setViajeSeleccionado(primerViajeId);
          } else {
            console.log("No hay viajes para mostrar");
          }
        } else {
          console.log("Formato de respuesta incorrecto o no hay reservaciones");
          setViajesUsuario([]);
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
  }, [userId, isExplorer, todosLosViajes]); // Dependencia de todosLosViajes para que se ejecute después de cargar los nombres
  
  // Cargar calificaciones de Rangers cuando se selecciona un viaje
  useEffect(() => {
    const obtenerCalificacionesRanger = async () => {
      if (!viajeSeleccionado) {
        console.log("No hay viaje seleccionado");
        return;
      }
      
      try {
        console.log('Cargando calificaciones para el viaje:', viajeSeleccionado);
        const url = `${API_URL}/api/trips/${viajeSeleccionado}/ranger-califications`;
        console.log('URL de calificaciones:', url);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        console.log('Respuesta de calificaciones de ranger:', response.data);
        
        // Guardar las calificaciones en el estado por viaje
        setCalificacionesPorViaje(prev => ({
          ...prev,
          [viajeSeleccionado]: response.data
        }));
      } catch (err) {
        console.error('Error al obtener calificaciones:', err);
        
        // Inicializar con array vacío en caso de error
        setCalificacionesPorViaje(prev => ({
          ...prev,
          [viajeSeleccionado]: []
        }));
      }
    };
    
    obtenerCalificacionesRanger();
  }, [viajeSeleccionado]);
  
  // Verificar si el usuario ya ha calificado al Ranger del viaje seleccionado
  const yaCalificoRanger = () => {
    if (!viajeSeleccionado || !userId) return true;
    
    const calificacionesViaje = calificacionesPorViaje[viajeSeleccionado] || [];
    console.log("Verificando si usuario ya calificó al ranger:", { 
      userId, 
      calificacionesCount: calificacionesViaje.length,
      calificaciones: calificacionesViaje 
    });
    
    return calificacionesViaje.some(cal => cal.user_id === userId);
  };
  
  // Manejador para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaCalificacion(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejador para selección de estrellas
  const handleEstrellas = (valor) => {
    setNuevaCalificacion(prev => ({
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
    if (nuevaCalificacion.calification === 0 || !nuevaCalificacion.user_comment) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      console.log('Enviando calificación de ranger:', {
        trip_id: viajeSeleccionado,
        user_id: userId,
        calification: nuevaCalificacion.calification,
        user_comment: nuevaCalificacion.user_comment
      });
      
      const url = `${API_URL}/api/ranger-califications`;
      const token = localStorage.getItem('token');
      
      const response = await axios.post(url, 
        {
          trip_id: viajeSeleccionado,
          user_id: userId,
          calification: nuevaCalificacion.calification,
          user_comment: nuevaCalificacion.user_comment
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      console.log('Respuesta al crear calificación:', response.data);
      
      // Actualizar lista de calificaciones
      const calificacionesUrl = `${API_URL}/api/trips/${viajeSeleccionado}/ranger-califications`;
      const calificacionesResponse = await axios.get(calificacionesUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Actualizar las calificaciones para este viaje
      setCalificacionesPorViaje(prev => ({
        ...prev,
        [viajeSeleccionado]: calificacionesResponse.data
      }));
      
      // Reiniciar el formulario
      setNuevaCalificacion({
        calification: 0,
        user_comment: ''
      });
      
      // Mostrar mensaje de éxito
      setMensajeExito(true);
      setError('');
      setTimeout(() => setMensajeExito(false), 3000);
      
    } catch (err) {
      console.error('Error al enviar calificación de ranger:', err);
      
      if (err.response) {
        if (err.response.status === 409) {
          setError('Ya has calificado al Ranger de este viaje anteriormente');
        } else {
          setError(`Error: ${err.response.data?.error || 'No se pudo enviar tu calificación'}`);
        }
      } else {
        setError('No se pudo enviar tu calificación. Por favor, intenta más tarde.');
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
  
  const calificacionesViaje = viajeSeleccionado ? (calificacionesPorViaje[viajeSeleccionado] || []) : [];
  console.log("Estado actual:", {
    viajeSeleccionado,
    hayViajes: viajesUsuario.length > 0,
    calificacionesViaje: calificacionesViaje.length,
    puedeCalificar: isExplorer && !yaCalificoRanger()
  });
  
  return (
    <div className="seccion-comentarios">
      <h2 className="titulo">Califica a tu Ranger</h2>
      
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
                {viaje.trip_name}
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
          {/* Lista de calificaciones de ranger para el viaje seleccionado */}
          <div className="lista-comentarios">
            <h3>Calificaciones del Ranger para este viaje</h3>
            {calificacionesViaje.length > 0 ? (
              calificacionesViaje.map(calificacion => (
                <div key={calificacion.id} className="comentario">
                  <div className="comentario-cabecera">
                    <div>
                      <p className="nombre-usuario">{calificacion.user_name}</p>
                      <Estrellas cantidad={calificacion.calification} />
                    </div>
                    <p className="fecha">{formatearFecha(calificacion.created_at)}</p>
                  </div>
                  <p className="texto-comentario">{calificacion.user_comment}</p>
                </div>
              ))
            ) : (
              <p className="sin-comentarios">Todavía no hay calificaciones para el Ranger de este viaje.</p>
            )}
          </div>
          
          {/* Formulario para añadir calificación - SOLO PARA EXPLORERS QUE NO HAN CALIFICADO */}
          {isExplorer && !yaCalificoRanger() && (
            <div className="formulario-container">
              <h3 className="subtitulo">Califica al Ranger de tu viaje</h3>
              
              {mensajeExito && (
                <div className="mensaje-exito">
                  ¡Gracias por tu opinión! Tu calificación ayudará a otros aventureros.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="campo-formulario">
                  <label>Calificación</label>
                  <Estrellas 
                    cantidad={nuevaCalificacion.calification} 
                    onSeleccion={handleEstrellas} 
                  />
                </div>
                
                <div className="campo-formulario">
                  <label>Tu comentario sobre el Ranger</label>
                  <textarea 
                    name="user_comment" 
                    value={nuevaCalificacion.user_comment} 
                    onChange={handleChange}
                    rows="4"
                    placeholder="Comparte tu experiencia con el Ranger de esta aventura..."
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