import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

interface Location {
  lat: number;
  lng: number;
  time: string;
  reward: number;
}

interface QRCodeScanMapProps {
  locations: Location[];
}

declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    chunkedLoading?: boolean;
    zoomToBoundsOnClick?: boolean;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
}

const QRCodeScanMap: React.FC<QRCodeScanMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
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
        maxClusterRadius: 50,
        iconCreateFunction: (cluster) => {
          const childCount = cluster.getChildCount();
          let c = ' marker-cluster-';
          if (childCount < 10) {
            c += 'small';
          } else if (childCount < 100) {
            c += 'medium';
          } else {
            c += 'large';
          }
          return new L.DivIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster' + c,
            iconSize: new L.Point(40, 40)
          });
        }
      });

      locations.forEach((loc) => {
        const marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 5,
          fillColor: '#00C49F', // All locations are claimed
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

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default QRCodeScanMap;