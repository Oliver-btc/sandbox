import { ReactNode } from 'react';
import L from 'leaflet';

declare module 'react-leaflet-markercluster' {
  interface MarkerClusterGroupProps {
    children: ReactNode;
    chunkedLoading?: boolean;
    maxClusterRadius?: number;
    spiderfyOnMaxZoom?: boolean;
    disableClusteringAtZoom?: number;
    iconCreateFunction?: (cluster: L.MarkerCluster) => L.DivIcon;
    // Add any other props you're using
  }

  const MarkerClusterGroup: React.FC<MarkerClusterGroupProps>;

  export default MarkerClusterGroup;
}