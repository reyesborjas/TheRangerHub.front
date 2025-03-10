// Regiones según el país seleccionado
export const getRegionsByCountry = (country) => {
    const regionMap = {
        "Chile": ["Santiago", "Valparaíso", "Biobío", "Araucanía", "Antofagasta", "Coquimbo", "Los Lagos"],
        "Argentina": ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"],
        "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla"],
        "Peru": ["Lima", "Arequipa", "Cusco", "Trujillo"],
        "Mexico": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"]
    };
    
    return regionMap[country] || ["Otra"];
};

// Listado de países latinoamericanos
export const latinCountries = [
    "Argentina", 
    "Bolivia", 
    "Brasil", 
    "Chile", 
    "Colombia", 
    "Costa Rica", 
    "Cuba", 
    "Ecuador", 
    "El Salvador", 
    "Guatemala", 
    "Honduras", 
    "México", 
    "Nicaragua", 
    "Panamá", 
    "Paraguay", 
    "Perú", 
    "República Dominicana", 
    "Uruguay", 
    "Venezuela"
];