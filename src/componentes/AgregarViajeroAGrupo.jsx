import React, { useState, useEffect } from "react";
import { Paper, Typography, Button, TextField, Alert, Container, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useLocation } from "react-router-dom";


const AgregarViajeroAGrupo = () => {
  const { state } = useLocation();
  const { grupoId, grupoNombre } = state || {};
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(grupoId || "");
  const [nombreGrupo, setNombreGrupo] = useState(grupoNombre || "");
  const [viajero, setViajero] = useState({ primerNombre: "", primerApellido: "", pasaporte: "" });
  const [grupos, setGrupos] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (state?.grupoId) {
        // Si se pasa un grupo desde el estado, solo carga ese grupo
        setGrupos([{ id: state.grupoId, nombre: state.grupoNombre }]);
        setGrupoSeleccionado(state.grupoId);
        setNombreGrupo(state.grupoNombre);
    } else {
        // Si no, carga la lista de grupos de la API
        fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Error al cargar los grupos');
                return response.json();
            })
            .then((data) => {
                setGrupos(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error('Error:', error);
                setError("Error al cargar los grupos disponibles.");
                setGrupos([]); // Aseguramos que grupos sea un array vacío en caso de error
            });
    }
}, [state, baseUrl]); // Removemos grupoSeleccionado de las dependencias

  useEffect(() => {
    // Actualiza `nombreGrupo` cada vez que `grupoSeleccionado` cambia y `grupos` tiene datos
    if (grupoSeleccionado && grupos.length > 0) {
      const grupo = grupos.find(g => g.id === grupoSeleccionado);
      if (grupo) {
        setNombreGrupo(grupo.nombre);
      }
    }
  }, [grupoSeleccionado, grupos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grupoSeleccionado) {
      setError("Por favor selecciona un grupo.");
      return;
    }

    fetch(`${baseUrl}/GrupoDeViaje/agregarViajero/${grupoSeleccionado}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(viajero),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.mensaje || "Ocurrió un error al agregar al viajero.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setSuccess(true);
        setError(null);
        setViajero({ primerNombre: "", primerApellido: "", pasaporte: "" });
      })
      .catch((err) => {
        setError(err.message);
        setSuccess(false);
      });
  };


  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Agregar Pasajero al Grupo: {nombreGrupo || 'Selecciona un grupo'}
          </Typography>
          <form onSubmit={handleSubmit}>
          {!grupoSeleccionado && (
    <FormControl fullWidth margin="normal" required>
        <InputLabel>Grupo de Viaje</InputLabel>
        <Select
            value={grupoSeleccionado}
            onChange={(e) => {
                const seleccionado = e.target.value;
                setGrupoSeleccionado(seleccionado);
                const grupoSelec = grupos.find(g => g.id === seleccionado);
                if (grupoSelec) {
                    setNombreGrupo(grupoSelec.nombre);
                }
            }}
            label="Grupo de Viaje"
        >
            {Array.isArray(grupos) && grupos.map((grupo) => (
                <MenuItem key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
)}
            <TextField
              fullWidth
              label="Primer Nombre"
              value={viajero.primerNombre}
              onChange={(e) => setViajero({ ...viajero, primerNombre: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Primer Apellido"
              value={viajero.primerApellido}
              onChange={(e) => setViajero({ ...viajero, primerApellido: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Número de Pasaporte"
              value={viajero.pasaporte}
              onChange={(e) => setViajero({ ...viajero, pasaporte: e.target.value })}
              required
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Agregar Pasajero
            </Button>
          </form>
          {success && <Alert severity="success" sx={{ mt: 2 }}>Pasajero agregado correctamente.</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
      </Container>
    </>
  );
};

export default AgregarViajeroAGrupo;