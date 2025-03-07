import React, { useState, useEffect } from "react";
import "../styles/RightPanel.css";
import axios from "axios";

// Función para generar los días del mes con ajuste de inicio de semana
const generateMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate(); 

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { daysArray, firstDay };
};

// Colores para los diferentes viajes
const TRIP_COLORS = [
    "#4285F4", // Azul
    "#EA4335", // Rojo
    "#FBBC05", // Amarillo
    "#34A853", // Verde
    "#8E24AA", // Púrpura
    "#16A2D7", // Azul claro
    "#FF9800", // Naranja
    "#795548"  // Marrón
];

const RightPanel = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [monthsToShow, setMonthsToShow] = useState([]);
    
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); 
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Obtener información del usuario desde el token JWT
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setUserId(decoded.user_id);
                setUserRole(decoded.role_name);
            } else {
                // Intentar obtener desde currentUser como respaldo
                const currentUserStr = localStorage.getItem('currentUser');
                if (currentUserStr) {
                    const currentUser = JSON.parse(currentUserStr);
                    setUserId(currentUser.id);
                    setUserRole(currentUser.role_name);
                } else {
                    setError("No se pudo identificar al usuario");
                }
            }
        } catch (err) {
            console.error("Error al procesar datos del usuario:", err);
            setError("Error al identificar usuario");
        }
    }, []);

    // Cargar viajes del usuario según su rol
    useEffect(() => {
        const fetchTrips = async () => {
            if (!userId || !userRole) return;
            
            setLoading(true);
            try {
                const baseUrl = "https://rangerhub-back.vercel.app";
                const endpoint = userRole === 'Ranger' || userRole === 'ranger'
                    ? `/trips/ranger/${userId}` 
                    : `/trips/explorer/${userId}`;
                
                const response = await axios.get(`${baseUrl}${endpoint}`);
                
                if (response.data && response.data.trips) {
                    // Procesar viajes para agregarles un color distintivo y asegurar que las fechas sean objetos Date
                    const processedTrips = response.data.trips.map((trip, index) => {
                        // Asegurarnos de que start_date y end_date sean objetos Date válidos
                        let startDate = trip.start_date ? new Date(trip.start_date) : null;
                        let endDate = trip.end_date ? new Date(trip.end_date) : null;
                        
                        // Validar que las fechas sean válidas
                        if (startDate === null || isNaN(startDate.getTime())) {
                            console.warn("Fecha de inicio inválida para el viaje:", trip);
                            startDate = new Date(); // Usar fecha actual como fallback
                        }
                        
                        if (endDate === null || isNaN(endDate.getTime())) {
                            console.warn("Fecha de fin inválida para el viaje:", trip);
                            endDate = startDate; // Usar fecha de inicio como fallback
                        }
                        
                        return {
                            ...trip,
                            color: TRIP_COLORS[index % TRIP_COLORS.length],
                            start_date: startDate,
                            end_date: endDate
                        };
                    });
                    
                    console.log("Viajes procesados:", processedTrips);
                    setTrips(processedTrips);
                    
                    // Determinar los meses a mostrar basados en el próximo viaje
                    determineMonthsToShow(processedTrips);
                }
            } catch (err) {
                console.error("Error al cargar viajes:", err);
                setError("Error al cargar los viajes");
            } finally {
                setLoading(false);
            }
        };
        
        if (userId && userRole) {
            fetchTrips();
        }
    }, [userId, userRole]);

    // Determinar qué meses mostrar basados en el próximo viaje
    const determineMonthsToShow = (trips) => {
        // Iniciar con el mes actual y el siguiente
        let firstMonthIndex = currentMonth;
        let firstMonthYear = currentYear;
        let secondMonthIndex = (currentMonth + 1) % 12;
        let secondMonthYear = currentYear + Math.floor((currentMonth + 1) / 12);
        
        if (trips.length > 0) {
            // Encontrar el próximo viaje (el que está más cercano a la fecha actual)
            const now = new Date();
            const upcomingTrips = trips.filter(trip => trip.start_date >= now);
            
            if (upcomingTrips.length > 0) {
                // Ordenar por fecha más cercana
                upcomingTrips.sort((a, b) => a.start_date - b.start_date);
                const nextTrip = upcomingTrips[0];
                
                firstMonthIndex = nextTrip.start_date.getMonth();
                firstMonthYear = nextTrip.start_date.getFullYear();
                secondMonthIndex = (firstMonthIndex + 1) % 12;
                secondMonthYear = firstMonthYear + Math.floor((firstMonthIndex + 1) / 12);
            }
        }
        
        // Generar datos para el primer mes
        const firstMonthData = {
            index: firstMonthIndex,
            year: firstMonthYear,
            name: new Date(firstMonthYear, firstMonthIndex, 1).toLocaleString('default', { month: 'long' }).toUpperCase(),
            ...generateMonthDays(firstMonthYear, firstMonthIndex)
        };
        
        // Generar datos para el segundo mes
        const secondMonthData = {
            index: secondMonthIndex,
            year: secondMonthYear,
            name: new Date(secondMonthYear, secondMonthIndex, 1).toLocaleString('default', { month: 'long' }).toUpperCase(),
            ...generateMonthDays(secondMonthYear, secondMonthIndex)
        };
        
        console.log("Meses a mostrar:", [firstMonthData, secondMonthData]);
        setMonthsToShow([firstMonthData, secondMonthData]);
    };

    // Comprobar si un día determinado está dentro de las fechas de un viaje
    const getTripForDay = (year, month, day) => {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0); // Normalizar a inicio del día
        
        return trips.find(trip => {
            // Normalizar fechas del viaje a inicio del día para comparación correcta
            const startDate = new Date(trip.start_date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(trip.end_date);
            endDate.setHours(23, 59, 59, 999); // Fin del día para incluir día completo
            
            return date >= startDate && date <= endDate;
        });
    };

    // Función para renderizar el calendario de cada mes
    const renderCalendar = (monthData) => (
        <div className="calendar-section" key={`${monthData.year}-${monthData.index}`}>
            <h5 className="month-title">{monthData.name} {monthData.year}</h5>
            <div className="days-of-week">
                <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
            </div>
            <div className="days-grid">
                {/* Espacios vacíos para alinear correctamente el inicio del mes */}
                {Array.from({ length: monthData.firstDay === 0 ? 6 : monthData.firstDay - 1 }, (_, i) => (
                    <div key={`empty-${i}`} className="day-cell empty"></div>
                ))}
                
                {/* Días del mes */}
                {monthData.daysArray.map((day) => {
                    const trip = getTripForDay(monthData.year, monthData.index, day);
                    const isToday = monthData.index === currentMonth && 
                                   day === currentDay && 
                                   monthData.year === currentYear;
                    
                    return (
                        <div 
                            key={day} 
                            className={`day-cell ${isToday ? "active-day" : ""} ${trip ? "trip-day" : ""}`}
                            style={trip ? { backgroundColor: trip.color, color: 'white' } : {}}
                            title={trip ? `${trip.trip_name}` : ""}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // Renderizar leyenda de viajes
    const renderTripLegend = () => {
        if (trips.length === 0) return null;
        
        return (
            <div className="trip-legend mt-3">
                <h6>Mis Viajes</h6>
                <ul className="list-unstyled">
                    {trips.map((trip, index) => (
                        <li key={index} className="mb-1">
                            <span 
                                className="color-dot" 
                                style={{ backgroundColor: trip.color }}
                            ></span>
                            <span className="trip-name">{trip.trip_name}</span>
                            <small className="text-muted ms-1">
                                {formatDate(trip.start_date)}
                                {trip.end_date && !areSameDay(trip.start_date, trip.end_date) ? 
                                    ` → ${formatDate(trip.end_date)}` : ''}
                            </small>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    
    // Funciones auxiliares para fechas
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    const areSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.getFullYear() === date2.getFullYear() &&
              date1.getMonth() === date2.getMonth() &&
              date1.getDate() === date2.getDate();
    };

    return (
        <div className="right-panel">
            <div className="card calendar-timeline-card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center my-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <>
                            {/* Leyenda de viajes */}
                            {renderTripLegend()}
                            
                            {/* Separador */}
                            <hr />
                            
                            {/* Calendarios */}
                            <div className="calendars-container">
                                {monthsToShow.map(monthData => renderCalendar(monthData))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RightPanel;