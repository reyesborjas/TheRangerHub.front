import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import axios from "axios";

// Fallback en caso de que no haya actividades
const FALLBACK_LOCATIONS = [
  { place_name: "Santiago, Chile", coordinates: "(-33.4489,-70.6693)" }
];

const OpenLayersMap = ({ tripId, defaultLat = -33.4489, defaultLon = -70.6693, defaultZoom = 8 }) => {
    const mapRef = useRef(null);
    const mapElement = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationCount, setLocationCount] = useState(0);

    // Función para extraer coordenadas del formato "(-39.4198,-71.9347)"
    const parseCoordinates = (coordsStr) => {
        try {
            // Eliminar paréntesis y dividir por coma
            const cleanStr = coordsStr.replace(/[()]/g, '');
            const [lat, lon] = cleanStr.split(',').map(coord => parseFloat(coord.trim()));
            return { lat, lon };
        } catch (err) {
            console.error("Error al parsear coordenadas:", coordsStr);
            return { lat: defaultLat, lon: defaultLon };
        }
    };

    // Inicializar mapa
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = new Map({
                target: mapElement.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([defaultLon, defaultLat]),
                    zoom: defaultZoom,
                }),
            });
        }
    }, [defaultLat, defaultLon, defaultZoom]);

    // Cargar ubicaciones para el viaje
    useEffect(() => {
        const fetchActivitiesWithLocations = async () => {
            if (!tripId || !mapRef.current) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // Usar el endpoint existente que ya incluye datos de locations
                const baseUrl = "https://rangerhub-back.vercel.app";
                const response = await axios.get(`${baseUrl}/trips/${tripId}/activities`);
                
                if (response.data && response.data.activities && response.data.activities.length > 0) {
                    // Extraer ubicaciones únicas usando un objeto regular
                    const uniqueLocationsObj = {};
                    
                    response.data.activities.forEach(activity => {
                        if (activity.coordinates && activity.place_name) {
                            uniqueLocationsObj[activity.location_id] = {
                                place_name: activity.place_name,
                                coordinates: activity.coordinates,
                                activity_name: activity.name
                            };
                        }
                    });
                    
                    // Convertir a array usando Object.values
                    const locations = Object.values(uniqueLocationsObj);
                    setLocationCount(locations.length);
                    
                    if (locations.length > 0) {
                        updateMap(locations);
                    } else {
                        updateMap(FALLBACK_LOCATIONS);
                    }
                } else {
                    setLocationCount(0);
                    updateMap(FALLBACK_LOCATIONS);
                }
            } catch (err) {
                console.error("Error al cargar actividades:", err);
                setError("No se pudieron cargar las ubicaciones");
                updateMap(FALLBACK_LOCATIONS);
            } finally {
                setLoading(false);
            }
        };
        
        fetchActivitiesWithLocations();
    }, [tripId]);

    // Actualizar mapa con ubicaciones
    const updateMap = (locations) => {
        if (!mapRef.current || !locations || locations.length === 0) return;
        
        // Crear capa de vectores para los marcadores
        const features = locations.map(location => {
            // Extraer latitud y longitud
            const { lat, lon } = parseCoordinates(location.coordinates);
            
            const feature = new Feature({
                geometry: new Point(fromLonLat([lon, lat])),
                name: location.place_name,
                location: location
            });
            
            // Estilo para el marcador
            feature.setStyle(new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                    scale: 0.5
                }),
                text: new Text({
                    text: location.place_name,
                    offsetY: -15,
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2
                    })
                })
            }));
            
            return feature;
        });
        
        // Crear capa de vectores y añadirla al mapa
        const vectorSource = new VectorSource({
            features: features
        });
        
        const vectorLayer = new VectorLayer({
            source: vectorSource
        });
        
        // Eliminar capas vectoriales existentes y añadir la nueva
        mapRef.current.getLayers().getArray()
            .filter(layer => layer instanceof VectorLayer)
            .forEach(layer => mapRef.current.removeLayer(layer));
        
        mapRef.current.addLayer(vectorLayer);
        
        // Ajustar vista para mostrar todos los marcadores
        if (features.length > 0) {
            try {
                const extent = vectorSource.getExtent();
                mapRef.current.getView().fit(extent, { 
                    padding: [50, 50, 50, 50],
                    maxZoom: 12
                });
            } catch (err) {
                console.error("Error al ajustar la vista:", err);
                // Fallback: centrar en el primer marcador
                const firstFeature = features[0];
                const coords = firstFeature.getGeometry().getCoordinates();
                mapRef.current.getView().setCenter(coords);
                mapRef.current.getView().setZoom(10);
            }
        }
    };

    return (
        <div className="position-relative">
            <div
                ref={mapElement}
                style={{ width: "100%", height: "300px" }}
            />
            {loading && (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            )}
            {error && (
                <div className="position-absolute bottom-0 start-0 end-0 mb-2 mx-2">
                    <div className="alert alert-warning py-1 mb-0 text-center small">
                        {error}
                    </div>
                </div>
            )}
            {!loading && locationCount === 0 && !error && (
                <div className="position-absolute top-0 start-0 end-0 mt-2 mx-2">
                    <div className="alert alert-info py-1 mb-0 text-center small">
                        No hay ubicaciones disponibles para este viaje
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpenLayersMap;