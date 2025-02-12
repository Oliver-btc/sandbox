'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface Location {
  lat: number;
  lng: number;
  time: string;
  reward: number;
}

interface QRCodeScanMapProps {
  locations: Location[];
}

// Dynamically import Leaflet components
const Map = dynamic(
  () => import('leaflet').then((L) => {
    // Import marker cluster when Leaflet is loaded
    require('leaflet.markercluster');
    return function MapComponent({ locations, mapRef }: { locations: Location[], mapRef: React.RefObject<HTMLDivElement> }) {
      const [mapInstance, setMapInstance] = useState<any>(null);
      const mapInitializedRef = useRef(false);

      useEffect(() => {
        if (mapRef.current && !mapInstance && !mapInitializedRef.current) {
          mapInitializedRef.current = true;
          const map = L.map(mapRef.current, {
            center: [39.8283, -98.5795],
            zoom: 4,
            maxZoom: 18,
            zoomControl: false
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          L.control.zoom({ position: 'topright' }).addTo(map);

          setMapInstance(map);
        }

        return () => {
          if (mapInstance) {
            mapInstance.remove();
            mapInitializedRef.current = false;
            setMapInstance(null);
          }
        };
      }, [mapRef, mapInstance]);

      useEffect(() => {
        if (mapInstance) {
          const clusterLayer = L.markerClusterGroup({
            chunkedLoading: true,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 50
          });

          locations.forEach((loc) => {
            const marker = L.circleMarker([loc.lat, loc.lng], {
              radius: 5,
              fillColor: '#00C49F',
              color: '#000000',
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.8,
            });

            const date = new Date(loc.time);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();

            const popupContent = `
              <div style="font-family: Arial, sans-serif; line-height: 1.2;">
                <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 5px; border-radius: 5px;">
                  <img src="/images/Bitcoin Logo.png" alt="Bitcoin Logo" style="width: 24px; height: 24px; margin-right: 10px;" />
                  <h3 style="margin: 0; color: #000000; font-weight: bold; font-size: 14px;">Claimed Reward Details</h3>
                </div>
                <p style="margin: 4px 0;"><strong>Time:</strong> ${formattedDate} ${formattedTime}</p>
                <p style="margin: 4px 0;"><strong>Location:</strong> ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}</p>
                <p style="margin: 4px 0;"><strong>Reward:</strong> ${loc.reward} satoshis</p>
              </div>
            `;

            marker.bindPopup(popupContent, {
              maxWidth: 300,
              className: 'custom-popup'
            });
            clusterLayer.addLayer(marker);
          });

          mapInstance.addLayer(clusterLayer);

          return () => {
            mapInstance.removeLayer(clusterLayer);
          };
        }
      }, [mapInstance, locations]);

      return null;
    };
  }),
  { ssr: false }
);

const QRCodeScanMap: React.FC<QRCodeScanMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mapRef} style={{ height: '100%', width: '100%' }}>
      <Map locations={locations} mapRef={mapRef} />
    </div>
  );
};

export default QRCodeScanMap;