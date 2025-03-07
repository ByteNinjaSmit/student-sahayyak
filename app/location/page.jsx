"use client";

import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";

export default function GeolocationComponent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure the component is mounted before rendering geolocation
  }, []);

  const {
    coords, // Contains the latitude and longitude
    isGeolocationAvailable,
    isGeolocationEnabled,
    errorMessage,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true, // Enable high accuracy mode
      timeout: 5000, // Set timeout to 5 seconds
      maximumAge: 0, // Prevent caching
    },
    watchPosition: true, // Monitor geolocation changes dynamically
  });

  if (!isMounted) {
    return <p>Loading...</p>;
  }

  if (!isGeolocationAvailable) {
    return <p>Geolocation is not supported by your browser.</p>;
  }

  if (!isGeolocationEnabled && !coords) {
    return <p>Please enable geolocation in your browser settings.</p>;
  }

  if (errorMessage && !coords) {
    return <p>Error: {errorMessage}</p>;
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-center">Current Location</h1>
      <div className="mt-4 text-center">
        {coords ? (
          <div>
            <p className="text-lg">
              <strong>Latitude:</strong> {coords.latitude}
            </p>
            <p className="text-lg">
              <strong>Longitude:</strong> {coords.longitude}
            </p>
            <p className="text-lg">
              <strong>Accuracy:</strong> {coords.accuracy} meters
            </p>
          </div>
        ) : (
          <p className="text-yellow-500">Fetching location...</p>
        )}
      </div>
    </div>
  );
}
