import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faBus, faHotel } from "@fortawesome/free-solid-svg-icons";
import "../styles/RightPanel.css";


const generateMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate(); 

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { daysArray, firstDay };
};

const RightPanel = () => {
    const currentYear = new Date().getFullYear();
    
  
    const { daysArray: februaryDays, firstDay: firstDaySep } = generateMonthDays(currentYear, 8);
    const { daysArray: marchDays, firstDay: firstDayOct } = generateMonthDays(currentYear, 9);

    const events = [
        { id: 1, title: "Santiago -> Puerto Varas", timeRange: "8:00 - 9:15", color: "#DCE7FF", icon: faPlane },
        { id: 2, title: "Bus transfer", timeRange: "9:30 - 10:00", color: "#FFEDD6", icon: faBus },
        { id: 3, title: "Check into a hotel", timeRange: "10:00 - 10:30", color: "#D9FDD3", icon: faHotel },
    ];

    const renderCalendar = (monthName, days, firstDay) => (
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
                {days.map((day) => (
                    <div key={day} className="day-cell">{day}</div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="right-panel"style={ {paddingTop:"3px", marginTop: "10px"}}>
            <div className="card calendar-timeline-card">
                <div className="card-body">
                    {/* Mini-calendarios dinámicos para septiembre y octubre */}
                    {renderCalendar("February", februaryDays, firstDaySep)} <br></br><br></br><br></br>
                    {renderCalendar("March", marchDays, firstDayOct)}

                    <br></br><br></br>
                    <img className="logo" src="https://avatars.sched.co/5/cb/8689106/avatar.jpg?9cc" alt="Logo 4Geeks" style={ {borderRadius: "50%",width:"200px", height:"200px%" , marginLeft: "50px"}}/>
                </div>
            </div>
        </div>

        
    );
};

export default RightPanel;
