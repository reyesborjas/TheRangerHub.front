import React, { useState } from 'react';

const Blog = () => {
  const [noticiaActiva, setNoticiaActiva] = useState(0);

  const noticias = [
    {
      id: 1,
      titulo: "Deportes de aventura y sus beneficios para la salud",
      fecha: "8 de marzo, 2025",
      autor: "Camila Rodríguez",
      resumen: "Descubre cómo los deportes de aventura mejoran tu condición física y mental",
      contenido: (
        <>
          <p>Los deportes de aventura no solo son una excelente forma de experimentar emociones fuertes, sino que también ofrecen numerosos beneficios para la salud tanto física como mental. Actividades como el senderismo, escalada, mountain bike y rafting ayudan a mejorar la resistencia cardiovascular, fortalecer músculos y aumentar la densidad ósea.</p>

          <p>Según estudios recientes, practicar deportes al aire libre reduce significativamente los niveles de cortisol, la hormona del estrés, mientras aumenta la producción de endorfinas. Esto se traduce en mejor estado de ánimo, reducción de ansiedad y mayor claridad mental.</p>

          <p>Además, la exposición a entornos naturales mejora la concentración y la creatividad. Los expertos recomiendan al menos dos horas semanales de actividad física en la naturaleza para experimentar estos beneficios.</p>

          <p>La combinación de desafío físico, exposición a la naturaleza y superación personal hace de los deportes de aventura una opción ideal para quienes buscan mejorar su salud de manera integral.</p>
        </>
      ),
      imagen: "https://images.ecestaticos.com/37BtC2qV7E7188eeiimvgqmNdrc=/0x139:2710x1667/1600x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F251%2Fa33%2Ffa4%2F251a33fa465096ed19fe8ba0d7719a77.jpg",
      alt: "Personas practicando senderismo en montañas"
    },
    {
      id: 2,
      titulo: "Campeonato Mundial de Deportes Extremos 2025: Chile brilla en varias categorías",
      fecha: "5 de marzo, 2025",
      autor: "Rodrigo Méndez",
      resumen: "Atletas chilenos destacan en mountainbike, escalada y kayak extremo",
      contenido: (
        <>
          <p>El Campeonato Mundial de Deportes Extremos 2025 ha finalizado con excelentes resultados para los representantes chilenos. La competición, celebrada en diversas locaciones de Suiza, reunió a más de 500 atletas de 45 países en disciplinas como mountainbike downhill, escalada deportiva, kayak extremo y parapente acrobático.</p>

          <p>Tomás Fernández logró la medalla de plata en mountainbike downhill, superando a competidores de Francia y Canadá. "Las condiciones fueron extremadamente desafiantes, con lluvia y barro en la mayoría del recorrido, pero la preparación en los terrenos técnicos de Chile me dio ventaja", comentó Fernández tras la premiación.</p>

          <p>En escalada deportiva, Valentina Cortés alcanzó el cuarto lugar en la categoría de dificultad, mientras que Pedro Alarcón se posicionó entre los diez mejores en kayak extremo. El equipo nacional terminó en el octavo puesto del medallero general, su mejor resultado histórico.</p>

          <p>El próximo campeonato mundial se celebrará en 2027 en Nueva Zelanda, y los clasificatorios comenzarán a finales de este año.</p>
        </>
      ),
      imagen: "https://triatletasenred.sport.es/wp-content/uploads/BTT-1280x720.jpg",
      alt: "Competidor de mountainbike en descenso"
    },
    {
      id: 3,
      titulo: "Los 5 destinos más demandados para deportes extremos en Chile",
      fecha: "1 de marzo, 2025",
      autor: "Javiera Soto",
      resumen: "Desde la Patagonia hasta el desierto de Atacama, Chile ofrece escenarios únicos para los amantes de la adrenalina",
      contenido: (
        <>
          <p>Chile, con su diversa geografía que abarca desde áridos desiertos hasta glaciares imponentes, se ha consolidado como un destino de élite para los amantes de los deportes extremos. Según datos de Sernatur, estos son los cinco destinos más solicitados por turistas nacionales e internacionales:</p>

          <h3>1. Pucón y el Volcán Villarrica</h3>
          <p>La joya de la región de La Araucanía lidera el ranking gracias a su versatilidad. Ofrece kayak en rápidos clase IV, canopy sobre bosques milenarios, mountain bike en rutas técnicas y, por supuesto, la posibilidad de escalar el activo volcán Villarrica. La temporada alta va de diciembre a marzo, aunque los deportes acuáticos son ideales en primavera.</p>

          <h3>2. Valle Nevado</h3>
          <p>No solo es el centro de esquí más grande de Sudamérica, sino que también se ha convertido en referencia para el snowboard extremo, freeride y saltos acrobáticos. Durante el verano, las pistas se transforman en rutas para mountain bike downhill que atraen competidores de todo el mundo.</p>

          <h3>3. Pichilemu</h3>
          <p>La capital del surf chileno ha visto un incremento del 45% en visitantes durante el último año. Sus olas en Punta de Lobos, consideradas entre las mejores del mundo para el big wave surfing, atraen a surfistas profesionales y entusiastas, especialmente entre mayo y agosto cuando las olas pueden superar los 8 metros.</p>

          <h3>4. Torres del Paine</h3>
          <p>Además del trekking tradicional, el parque nacional ofrece escalada en roca, ice climbing en glaciares y kayak entre témpanos. Las autoridades han habilitado nuevas rutas para deportes extremos, siempre bajo estrictos protocolos de conservación ambiental.</p>

          <h3>5. San Pedro de Atacama</h3>
          <p>El desierto más árido del mundo es escenario para sandboarding en dunas gigantes, mountain bike en terrenos lunares y parapente. Las nuevas rutas nocturnas para mountain bike, que aprovechan el cielo estrellado del desierto, han incrementado su popularidad entre los aficionados a deportes extremos.</p>
        </>
      ),
      imagen: "https://storage.googleapis.com/chile-travel-cdn/2021/03/volcan-villarrica-shutterstock_1420079189.jpg",
      alt: "Volcán Villarrica en Pucón, Chile"
    }
  ];

  const cambiarNoticia = (index) => {
    setNoticiaActiva(index);
  };

  const estilos = {
    container: {
      maxWidth: "100%",
      marginTop: "30px",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "20px",
      backgroundColor: "transparent",
      padding: "20px",
      borderRadius: "8px",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      borderBottom: "2px solid #e0e0e0",
      paddingBottom: "15px"
    },
    titulo: {
      fontSize: "2.2rem",
      color: "#2a2a2a",
      margin: "0 0 10px 0"
    },
    subtitulo: {
      fontSize: "1.1rem",
      color: "#666",
      fontWeight: "normal",
      margin: "0"
    },
    navegacion: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px"
    },
    botonNav: {
      padding: "10px 15px",
      backgroundColor: "#2a9d8f",
      color: "#fff",
      border: "none",
      transition: "background-color 0.3s ease",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    botonNavActivo: {
      backgroundColor: "#fff",
      color: "#2a9d8f",
      border: "1px solid #2a9d8f",
    },
    botonNavActivoAzul: {
      backgroundColor: "#fff",
      color: "#3498db",
      border: "1px solid #3498db",
    },
    noticiaContainer: {
      backgroundColor: "transparent",
      borderRadius: "6px",
      padding: "25px",
    },
    noticiaTitulo: {
      fontSize: "1.8rem",
      color: "#1a1a1a",
      marginTop: "0",
      marginBottom: "15px"
    },
    noticiaMetadata: {
      display: "flex",
      gap: "15px",
      color: "#777",
      fontSize: "0.9rem",
      marginBottom: "20px",
      borderBottom: "1px solid #f0f0f0",
      paddingBottom: "10px"
    },
    noticiaImagen: {
      width: "100%",
      borderRadius: "4px",
      marginBottom: "20px"
    },
    noticiaContenido: {
      fontSize: "1.05rem",
      lineHeight: "1.6",
      color: "#333"
    },
    noticiaResumen: {
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#444",
      marginBottom: "20px"
    },
    footer: {
      marginTop: "30px",
      textAlign: "center",
      fontSize: "0.9rem",
      color: "#666",
      borderTop: "1px solid #e0e0e0",
      paddingTop: "20px"
    }
  };

  const noticiaActual = noticias[noticiaActiva];

  return (
    <div style={estilos.container}>
      <header style={estilos.header}>
        <h1 style={estilos.titulo}>TheRangerHub E-Magazine</h1>
        <h2 style={estilos.subtitulo}>El blog de deportes extremos y aventura</h2>
      </header>

      <nav style={estilos.navegacion}>
        {noticias.map((noticia, index) => (
          <button
            key={noticia.id}
            onClick={() => cambiarNoticia(index)}
            style={{
              ...estilos.botonNav,
              ...(index === noticiaActiva ? estilos.botonNavActivo : {})
            }}
          >
            {noticia.titulo.substring(0, 25)}...
          </button>
        ))}
      </nav>

      <article style={estilos.noticiaContainer}>
        <h2 style={estilos.noticiaTitulo}>{noticiaActual.titulo}</h2>

        <div style={estilos.noticiaMetadata}>
          <span>Por: {noticiaActual.autor}</span>
          <span>Publicado: {noticiaActual.fecha}</span>
        </div>

        <p style={estilos.noticiaResumen}>{noticiaActual.resumen}</p>

        <img
          src={noticiaActual.imagen}
          alt={noticiaActual.alt}
          style={estilos.noticiaImagen}
        />

        <div style={estilos.noticiaContenido}>
          {noticiaActual.contenido}
        </div>
      </article>

      <footer style={estilos.footer}>
        <p>© 2025 TheRangerHub E-Magazine - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Blog;