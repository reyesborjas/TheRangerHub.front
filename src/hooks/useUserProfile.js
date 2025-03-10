import { useState, useEffect } from "react";

// Listas de datos disponibles
const availableLanguages = [
    "Español", "Inglés", "Portugués", "Francés", "Alemán", 
    "Italiano", "Chino", "Japonés", "Ruso", "Árabe"
];

const availableSpecialties = [
    "Scuba Diving", "Snorkeling", "Hiking", "Trekking",
    "Camping", "Kayaking", "Rock Climbing", "Mountaineering",
    "Wildlife Photography", "Bird Watching", "Ski", "Snowboard",
    "Canyoning", "Rafting", "Sandboard", "Cycling", "Rappel"
];

// Regiones según el país
const getRegionsByCountry = (country) => {
    const regionMap = {
        "Chile": ["Santiago", "Valparaíso", "Biobío", "Araucanía", "Antofagasta", "Coquimbo", "Los Lagos"],
        "Argentina": ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"],
        "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla"],
        "Peru": ["Lima", "Arequipa", "Cusco", "Trujillo"],
        "Mexico": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"]
    };
    
    return regionMap[country] || ["Otra"];
};

export const useUserProfile = (username) => {
    const [profileData, setProfileData] = useState({
        displayName: "",
        email: "",
        nationality: "",
        country: "",
        region: "",
        postcode: "",
        title: "",
        languages: [],
        specialties: [],
        profilePicture: ""
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Cargar datos del perfil
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const userToFetch = username || "current";
                const API_BASE_URL = "https://rangerhub-back.vercel.app";
                
                const response = await fetch(`${API_BASE_URL}/api/user-profile/${userToFetch}`, {
                    method: "GET", 
                    headers: { "Content-Type": "application/json" }
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.status}`);
                }
    
                const userData = await response.json();
                
                // Extraer datos desde biography_extend si están disponibles
                let languages = [];
                let title = "";
                let specialties = [];
                
                if (userData.biography_extend) {
                    try {
                        let bioExtend = userData.biography_extend;
                        if (typeof bioExtend === 'string') {
                            bioExtend = JSON.parse(bioExtend);
                        }
                        
                        if (bioExtend.title) title = bioExtend.title;
                        if (bioExtend.languages && Array.isArray(bioExtend.languages)) languages = bioExtend.languages;
                        if (bioExtend.specialties && Array.isArray(bioExtend.specialties)) specialties = bioExtend.specialties;
                    } catch (e) {
                        console.error("Error al procesar biography_extend:", e);
                    }
                }
    
                setProfileData({
                    displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                    email: userData.email || "",
                    nationality: userData.nationality || "",
                    country: userData.country || "",
                    region: userData.region || "",
                    postcode: userData.postcode || "",
                    title: title,
                    languages: languages.length > 0 ? languages : (userData.languages || []),
                    specialties: specialties.length > 0 ? specialties : (userData.specialties || []),
                    profilePicture: userData.profilePicture || userData.profile_picture_url || ""
                });
                
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("No se pudo cargar la información del perfil. Por favor, intenta más tarde.");
                setIsLoading(false);
            }
        };
    
        fetchUserProfile();
    }, [username]);
    
    // Auto-hide success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    
    // Handlers para cambios en los formularios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;
        
        if (checked) {
            setProfileData(prev => ({ 
                ...prev, 
                languages: [...prev.languages, value] 
            }));
        } else {
            setProfileData(prev => ({ 
                ...prev, 
                languages: prev.languages.filter(lang => lang !== value) 
            }));
        }
    };
    
    const handleSpecialtiesChange = (e) => {
        const { value, checked } = e.target;
    
        if (checked) {
            setProfileData(prev => ({ 
                ...prev, 
                specialties: [...prev.specialties, value] 
            }));
        } else {
            setProfileData(prev => ({ 
                ...prev, 
                specialties: prev.specialties.filter(spec => spec !== value) 
            }));
        }
    };
    
    // Guardar el perfil
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
    
        try {
            // Preparar datos para enviar con idiomas y título en biography_extend
            const biographyExtend = {
                languages: profileData.languages,
                title: profileData.title,
                specialties: profileData.specialties
            };
            
            const dataToSend = {
                email: profileData.email,
                nationality: profileData.nationality,
                country: profileData.country,
                region: profileData.region,
                postcode: profileData.postcode,
                profile_picture_url: profileData.profilePicture,
                biography_extend: biographyExtend
            };
            
            const API_BASE_URL = "https://rangerhub-back.vercel.app";
            const response = await fetch(`${API_BASE_URL}/api/user-profile/${username || "current"}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend)
            });
    
            if (!response.ok) {
                let errorMessage = "Error al guardar los cambios";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
    
            setSuccess("Cambios guardados correctamente");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.message || "Error al guardar los cambios. Por favor, intenta más tarde.");
        } finally {
            setIsSaving(false);
        }
    };
    
    return {
        profileData,
        isLoading,
        isSaving,
        error,
        success,
        setError,
        setSuccess,
        handleChange,
        handleLanguageChange,
        handleSpecialtiesChange,
        handleSubmit,
        availableLanguages,
        availableSpecialties,
        getRegionsByCountry
    };
};