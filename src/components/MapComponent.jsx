import { useEffect } from 'react';

const MapComponent = () => {
  useEffect(() => {
    // Asegúrate de que Leaflet está cargado
    const L = window.L;

    var map = L.map('map').setView([24.1425, -110.3105], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([24.1425, -110.3105]).addTo(map)
      .bindPopup("<b>Malecón de La Paz</b>")
      .openPopup();
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default MapComponent;
