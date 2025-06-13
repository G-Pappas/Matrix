import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

interface DeviceFormData {
  name: string;
  ip_address: string;
  device_type: string;
}

interface DeviceResponse extends DeviceFormData {
  id: number;
  created_at: string;
}

const DEVICE_TYPES = [
  'Router',
  'Switch',
  'Firewall',
  'Access Point',
  'Server',
  'Workstation',
  'Printer',
  'Camera',
  'Other'
];

const DeviceForm = () => {
  const { id } = useParams<{ id: string }>();
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
          const response = await axios.get<DeviceResponse>(`http://localhost:8000/devices/${id}`);
          // Only set the form fields we need
          setFormData({
            name: response.data.name,
            ip_address: response.data.ip_address,
            device_type: response.data.device_type,
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Device' : 'Add New Device'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Device Type</InputLabel>
            <Select
              name="device_type"
              value={formData.device_type}
              onChange={handleChange}
              label="Device Type"
            >
              {DEVICE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {id ? 'Update' : 'Add'} Device
            </Button>
            <Button
              onClick={() => navigate('/')}
              sx={{ ml: 1 }}
              variant="outlined"
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