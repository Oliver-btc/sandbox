import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatMapOptions {
  minOpacity?: number;
  maxZoom?: number;
  max?: number;
  radius?: number;
  blur?: number;
  gradient?: {[key: string]: string};
}

interface HeatmapLayerProps {
  points: [number, number, number][];
  options?: HeatMapOptions;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points, options = {} }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const defaultOptions: HeatMapOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 18,
      max: 1.0,
      minOpacity: 0.3,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red' }
    };

    const heatLayer = (L as any).heatLayer(points, { ...defaultOptions, ...options });
    map.addLayer(heatLayer);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer;