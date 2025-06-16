import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface DeviceType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

const DeviceTypeManager = () => {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<DeviceType | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  const fetchDeviceTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/device-types/');
      setDeviceTypes(response.data);
    } catch (error) {
      setError('Failed to fetch device types');
    }
  };

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const handleOpen = (type?: DeviceType) => {
    if (type) {
      setEditingType(type);
      setFormData({ name: type.name, description: type.description || '' });
    } else {
      setEditingType(null);
      setFormData({ name: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingType(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) {
        await axios.put(`http://localhost:8000/device-types/${editingType.id}`, formData);
      } else {
        await axios.post('http://localhost:8000/device-types/', formData);
      }
      handleClose();
      fetchDeviceTypes();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this device type?')) {
      try {
        await axios.delete(`http://localhost:8000/device-types/${id}`);
        fetchDeviceTypes();
      } catch (error: any) {
        setError(error.response?.data?.detail || 'Failed to delete device type');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Device Types</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Device Type
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description || '-'}</TableCell>
                <TableCell>{new Date(type.created_at).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(type)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(type.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingType ? 'Edit Device Type' : 'Add Device Type'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingType ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DeviceTypeManager; 