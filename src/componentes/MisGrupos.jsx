import React, { useEffect, useState, useCallback } from 'react';
import { 
    Box, 
    Typography, 
    Paper,  
    Button, 
    Snackbar, 
    Alert,
    Container,
    Divider,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { format } from 'date-fns';

const MisGrupos = () => {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const cargarGrupos = useCallback(() => {
     
        setLoading(true);
        fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar los grupos');
                return response.json();
            })
            .then(data => setGrupos(data))
            .catch(error => {
                console.error('Error:', error);
                setError('No se pudieron cargar los grupos');
            })
            .finally(() => setLoading(false));
    }, [baseUrl]);

    useEffect(() => {
        cargarGrupos();
    }, [cargarGrupos]);

    const handleDelete = useCallback((grupoId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
            fetch(`${baseUrl}/GrupoDeViaje/${grupoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error al eliminar el grupo');
                    setSuccess(true);
                    cargarGrupos();
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError('No se pudo eliminar el grupo');
                });
        }
    }, [baseUrl, cargarGrupos]);

    const formatFechaCorta = (fecha) => format(new Date(fecha), 'dd MMM yyyy');
    const isGrupoEnViaje = (fechaInicio) => new Date(fechaInicio) <= new Date();

    return (
    <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 2,
                justifyContent: 'center',
                width: '100%'
            }}>
       
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Mis grupos de viaje
        </Typography>
    </Box>

    {/* Estado de carga y errores */}
    {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
        </Box>
    )}
    {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
        </Alert>
    )}
    <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
    >
        <Alert severity="success" sx={{ width: '100%' }}>
            Operación realizada con éxito
        </Alert>
    </Snackbar>

    {/* Lista de Grupos */}
    {!loading && grupos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
                No tienes grupos de viaje creados.
            </Typography>
        </Paper>
    ) : (
    <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
        },
        gap: 3
    }}>
    {grupos.map(grupo => (
        <Paper
        key={grupo.id}
        elevation={3}
        sx={{
            p: 3,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 8
            }
        }}
    >
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {grupo.nombre}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        <strong>Fechas:</strong><br />
        {formatFechaCorta(grupo.fechaInicio)} - {formatFechaCorta(grupo.fechaFin)}
    </Typography>
                            
    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        <strong>Destinos:</strong><br />
        {grupo.paises && grupo.paises.map((pais, index) => (
            <Box key={index} sx={{ ml: 1, mb: 1 }}>
                • {pais.nombre}
                {pais.ciudades && (
                    <Box sx={{ ml: 2 }}>
                        {pais.ciudades.map((ciudad, cidx) => (
                            <Typography 
                                key={cidx} 
                                variant="body2" 
                                component="div"
                                sx={{ 
                                    fontSize: '0.9em',
                                    color: 'text.secondary'
                                }}
                            >
                                - {ciudad.nombre}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>
        ))}
    </Typography>

                                 <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    mt: 'auto' 
                                }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => navigate(`/agregarViajeroAGrupo/${grupo.id}`)}
                                        size="small"
                                        fullWidth
                                    >
                                        Agregar Viajero
                                    </Button>
                                    {/* <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate('/crearGrupoDeViaje', {
                                            state: { nombre: grupo.nombre, id: grupo.id }
                                        })}
                                        size="small"
                                        fullWidth
                                    >
                                        Editar
                                    </Button> */}
                                     <Button
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        onClick={() => handleDelete(grupo.id)}
                                        disabled={isGrupoEnViaje(grupo.fechaInicio)}
                                        size="small"
                                        fullWidth
                                    >
                                        Eliminar
                                    </Button> 
                                </Box> 
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default MisGrupos;