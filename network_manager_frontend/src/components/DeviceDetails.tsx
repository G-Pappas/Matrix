import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';

interface Device {
  id: number;
  name: string;
  ip_address: string;
  device_type: string;
  created_at: string;
}

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/devices/${id}`);
        setDevice(response.data);
      } catch (error) {
        console.error('Error fetching device:', error);
      }
    };
    fetchDevice();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await axios.delete(`http://localhost:8000/devices/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  if (!device) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography>Loading...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Device Details
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Name:</strong> {device.name}</Typography>
          <Typography><strong>IP Address:</strong> {device.ip_address}</Typography>
          <Typography><strong>Type:</strong> {device.device_type}</Typography>
          <Typography><strong>Created At:</strong> {new Date(device.created_at).toLocaleString()}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => navigate(`/devices/${device.id}/edit`)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          sx={{ ml: 1 }}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
      </Paper>
    </Container>
  );
};

export default DeviceDetails;