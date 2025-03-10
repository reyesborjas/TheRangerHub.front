import { useState, useEffect } from "react";

export const useFeedback = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Auto-hide success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    
    // Helper para mostrar un error temporal
    const showError = (message, duration = 0) => {
        setError(message);
        
        if (duration > 0) {
            setTimeout(() => {
                setError(null);
            }, duration);
        }
    };
    
    // Helper para mostrar un mensaje de éxito temporal
    const showSuccess = (message, duration = 5000) => {
        setSuccess(message);
        
        if (duration > 0) {
            setTimeout(() => {
                setSuccess(null);
            }, duration);
        }
    };
    
    return {
        error,
        success,
        setError,
        setSuccess,
        showError,
        showSuccess
    };
};