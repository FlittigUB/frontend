'use client';

import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const SimpleMap = () => {
  const [viewport, setViewport] = useState({
    longitude: 7.9956,
    latitude: 58.1467,
    zoom: 12,
  });

  return (
    <Map
      {...viewport}
      onMove={(evt) => setViewport(evt.viewState)} // Update viewport on move
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {/* Marker */}
      <Marker longitude={7.9956} latitude={58.1467} anchor="bottom">
        <div
          style={{
            backgroundColor: 'blue',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
          }}
        />
      </Marker>
    </Map>
  );
};

export default SimpleMap;
