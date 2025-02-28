import React from "react";
import "../styles/RightPanel.css";


const generateMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { daysArray, firstDay };
};

const RightPanel = () => {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); 
    const currentMonth = currentDate.getMonth(); 

    // Generar los días para febrero y marzo
    const { daysArray: februaryDays, firstDay: firstDayFeb } = generateMonthDays(currentYear, 1);
    const { daysArray: marchDays, firstDay: firstDayMar } = generateMonthDays(currentYear, 2); 

   
    const renderCalendar = (monthName, monthDays, firstDay, monthIndex) => (
        <div className="calendar-section">
            <h5 className="month-title">{monthName}</h5>
            <div className="days-of-week">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>
            <div className="days-grid">
                {/* Espacios vacíos para alinear correctamente el inicio del mes */}
                {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => (
                    <div key={`empty-${i}`} className="day-cell empty"></div>
                ))}
                {/* Días del mes */}
                {monthDays.map((day) => (
                    <div 
                        key={day} 
                        className={`day-cell ${monthIndex === currentMonth && day === currentDay ? "active-day" : ""}`}>
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="right-panel">
            <div className="card calendar-timeline-card">
                <div className="card-body">
                    {/* Mini-calendarios dinámicos para febrero y marzo */}
                    {renderCalendar("February", februaryDays, firstDayFeb, 1)}  {/* Febrero */} <br></br> <br></br>
                    {renderCalendar("March", marchDays, firstDayMar, 2)}  {/* Marzo */}

                </div>
            </div>
        </div>
    );
};

export default RightPanel;
