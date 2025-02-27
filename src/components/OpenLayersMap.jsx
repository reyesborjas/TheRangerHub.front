import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const OpenLayersMap = ({ lat, lon, zoom }) => {
    const mapRef = useRef(null);
    const mapElement = useRef();

    useEffect(() => {
        // Solo inicializa el mapa la primera vez
        if (!mapRef.current) {
            mapRef.current = new Map({
                target: mapElement.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([lon, lat]), // Convierte lat/lon a proyección interna
                    zoom: zoom,
                }),
            });
        }
    }, [lat, lon, zoom]);

    return (
        <div
            ref={mapElement}
            style={{ width: "100%", height: "200px" }}
        />
    );
};

export default OpenLayersMap;