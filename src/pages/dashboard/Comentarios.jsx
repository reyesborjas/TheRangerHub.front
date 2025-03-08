import React, { useState } from 'react';
import "../../styles/Comentarios.css";

const SeccionComentarios = () => {

  const [comentarios, setComentarios] = useState([
    { id: 1, usuario: 'María García', estrellas: 4, texto: '¡Increíble experiencia! Reservé un tour de rafting y la organización fue impecable. El guía conocía perfectamente la ruta y nos hizo sentir seguros en todo momento. Sin duda, volveré a probar más actividades con esta app.', fecha: '2025-02-15' },
    { id: 2, usuario: 'Juan Pérez', estrellas: 5, texto: 'La mejor app para amantes de los deportes extremos. Encontré un guía para escalada en roca en minutos y la experiencia superó mis expectativas. Fácil de usar y con opciones para todos los niveles. ¡Totalmente recomendada!', fecha: '2025-02-10' },
    { id: 3, usuario: 'Ana Rodríguez', estrellas: 3, texto: 'Muy buena aplicación, encontré rápidamente un tour de paracaidismo y todo salió genial. Solo mejoraría la opción de filtrar guías por experiencia para elegir con más confianza.', fecha: '2025-02-05' }
  ]);


  const [nuevoComentario, setNuevoComentario] = useState({
    usuario: '',
    estrellas: 0,
    texto: ''
  });


  const [mensajeExito, setMensajeExito] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoComentario(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleEstrellas = (valor) => {
    setNuevoComentario(prev => ({
      ...prev,
      estrellas: valor
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (!nuevoComentario.usuario || nuevoComentario.estrellas === 0 || !nuevoComentario.texto) {
      alert('Por favor completa todos los campos');
      return;
    }
    

    const comentario = {
      id: comentarios.length + 1,
      ...nuevoComentario,
      fecha: new Date().toISOString().split('T')[0]
    };
    
    setComentarios(prev => [...prev, comentario]);
    

    setNuevoComentario({
      usuario: '',
      estrellas: 0,
      texto: ''
    });
    

    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };


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

  return (
    <div className="seccion-comentarios">
      <h2 className="titulo">Comentarios de Clientes</h2>
      
      {/* Lista de comentarios */}
      <div className="lista-comentarios">
        {comentarios.map(comentario => (
          <div key={comentario.id} className="comentario">
            <div className="comentario-cabecera">
              <div>
                <p className="nombre-usuario">{comentario.usuario}</p>
                <Estrellas cantidad={comentario.estrellas} />
              </div>
              <p className="fecha">{comentario.fecha}</p>
            </div>
            <p className="texto-comentario">{comentario.texto}</p>
          </div>
        ))}
      </div>
      
      {/* Formulario para añadir comentario */}
      <div className="formulario-container">
        <h3 className="subtitulo">Añade tu comentario</h3>
        
        {mensajeExito && (
          <div className="mensaje-exito">
            ¡Gracias por tu comentario!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="campo-formulario">
            <label>Nombre</label>
            <input 
              type="text" 
              name="usuario" 
              value={nuevoComentario.usuario} 
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>
          
          <div className="campo-formulario">
            <label>Calificación</label>
            <Estrellas 
              cantidad={nuevoComentario.estrellas} 
              onSeleccion={handleEstrellas} 
            />
          </div>
          
          <div className="campo-formulario">
            <label>Comentario</label>
            <textarea 
              name="texto" 
              value={nuevoComentario.texto} 
              onChange={handleChange}
              rows="4"
              placeholder="Comparte tu experiencia..."
            />
          </div>
          
          <button type="submit" className="boton-enviar">
            Enviar Comentario
          </button>
        </form>
      </div>
    </div>
  );
};

export default SeccionComentarios;