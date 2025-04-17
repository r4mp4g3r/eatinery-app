import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  center: [number, number];
  destination: [number, number];
  zoom?: number;
  className?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  destination,
  zoom = 15,
  className = 'h-56',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add current location marker
      const currentLocationIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });

      L.marker(center, { icon: currentLocationIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Your Location');

      // Add destination marker
      const destinationIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });

      L.marker(destination, { icon: destinationIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Restaurant Location');

      // Draw a polyline between the two points
      const polyline = L.polyline([center, destination], { color: '#14B8A6' }).addTo(mapInstanceRef.current);
      
      // Fit the map to show the polyline
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [30, 30] });
    } else {
      // Update the map center and markers if it's already initialized
      mapInstanceRef.current.setView(center, zoom);
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      // Re-add markers and polyline
      L.marker(center).addTo(mapInstanceRef.current).bindPopup('Your Location');
      L.marker(destination).addTo(mapInstanceRef.current).bindPopup('Restaurant Location');
      const polyline = L.polyline([center, destination], { color: '#14B8A6' }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [30, 30] });
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current && !mapRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, destination, zoom]);

  return <div ref={mapRef} className={className} />;
};

export default LeafletMap;
