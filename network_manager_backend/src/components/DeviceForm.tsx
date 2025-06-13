import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

interface DeviceFormData {
  name: string;
  ip_address: string;
  device_type: string;
}

const DeviceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    ip_address: '',
    device_type: '',
  });

  useEffect(() => {
    if (id) {
      const fetchDevice = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/devices/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching device:', error);
        }
      };
      fetchDevice();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8000/devices/${id}`, formData);
      } else {
        await axios.post('http://localhost:8000/devices/', formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Device' : 'Add New Device'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Device Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="IP Address"
            name="ip_address"
            value={formData.ip_address}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Device Type"
            name="device_type"
            value={formData.device_type}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="router">Router</MenuItem>
            <MenuItem value="switch">Switch</MenuItem>
            <MenuItem value="server">Server</MenuItem>
            <MenuItem value="firewall">Firewall</MenuItem>
          </TextField>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {id ? 'Update Device' : 'Add Device'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DeviceForm; 