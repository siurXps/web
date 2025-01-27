import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Arreglo para el ícono del marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para centrar el mapa en la ubicación actual
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        }).on("locationerror", function (e) {
            setError(e.message);
        });
    }, [map]);

    return position === null ? (
        error ? <div>{error}</div> : null
    ) : (
        <Marker position={position}>
            <Popup>¡Estás aquí!</Popup>
        </Marker>
    );
}

const DondeEstoy = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState([0, 0]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Tu navegador no soporta geolocalización');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCenter([position.coords.latitude, position.coords.longitude]);
                setLoading(false);
            },
            (error) => {
                let errorMessage = 'No se pudo obtener tu ubicación';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'No has dado permiso para acceder a tu ubicación';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'La información de ubicación no está disponible';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Se agotó el tiempo para obtener la ubicación';
                        break;
                    default:
                        errorMessage = 'Ocurrió un error desconocido';
                }
                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }, []);

    if (loading || error) {
        return (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>
                        Obteniendo tu ubicación...
                    </Typography>
                </Box>
        );
    }

    return (
            <Box sx={{ p: 2 }}>
                <Button
                    onClick={() => navigate('/dashboard')}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        mb: 2,
                        backgroundColor: '#E3F2FD',
                        color: 'primary.main',
                        '&:hover': { backgroundColor: '#BBDEFB' }
                    }}
                >
                    Volver
                </Button>

                {error ? (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                ) : (
                    <Box sx={{ 
                        height: '70vh', 
                        width: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <MapContainer
                            center={center}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                            doubleClickZoom={true}
                            zoomControl={true}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    </Box>
                )}
            </Box>
    );
};

export default DondeEstoy;