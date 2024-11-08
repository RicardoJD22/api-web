// src/components/MapComponent.jsx
import React, { useEffect } from 'react';


const MapComponent = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = function () {
            new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
        };
        document.head.appendChild(script);
    }, []);

    return <div id="map" style={{ width: '100%', height: '100vh' }}></div>;
};

export default MapComponent;
