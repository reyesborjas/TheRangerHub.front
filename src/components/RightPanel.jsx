import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faBus, faHotel } from "@fortawesome/free-solid-svg-icons";
import "../styles/RightPanel.css";

const RightPanel = () => {
    const events = [
        {
            id: 1,
            title: "Santiago -> Puerto Varas",
            timeRange: "8:00 - 9:15",
            color: "#DCE7FF",
            icon: faPlane,
        },
        {
            id: 2,
            title: "Bus transfer",
            timeRange: "9:30 - 10:00",
            color: "#FFEDD6",
            icon: faBus,
        },
        {
            id: 3,
            title: "Check into a hotel",
            timeRange: "10:00 - 10:30",
            color: "#D9FDD3",
            icon: faHotel,
        },
    ];

    // Mini-calendario estático para septiembre (ejemplo).
    // Si quieres algo dinámico, puedes usar librerías tipo react-big-calendar, FullCalendar, etc.
    const daysInSeptember = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="right-panel">
            <div className="card calendar-timeline-card">
                <div className="card-body">
                    {/* Sección del mini-calendario */}
                    <div className="calendar-section">
                        <h5 className="month-title">September</h5>
                        <div className="days-of-week">
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                            <span>Su</span>
                        </div>
                        <div className="days-grid">
                            {daysInSeptember.map((day) => (
                                <div
                                    key={day}
                                    className={`day-cell ${day === 17 ? "active-day" : ""}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección de timeline (horarios de eventos) */}
                    <div className="timeline-section">
                        <h6 className="timeline-title">Timeline</h6>
                        <div className="timeline-container">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="timeline-event"
                                    style={{ backgroundColor: event.color }}
                                >
                                    <div className="event-icon">
                                        <FontAwesomeIcon icon={event.icon} />
                                    </div>
                                    <div className="event-info">
                                        <div className="event-time">{event.timeRange}</div>
                                        <div className="event-title">{event.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;