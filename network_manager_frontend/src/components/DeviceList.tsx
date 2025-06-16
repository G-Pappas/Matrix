import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Device {
  id: number;
  name: string;
  ip_address: string;
  device_type: string;
  created_at: string;
  tags: string[];
}

type GroupByOption = 'none' | 'device_type' | 'tags';

const DeviceList = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const navigate = useNavigate();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/devices/');
      console.log('Raw API response:', response);
      console.log('Fetched devices data:', response.data);
      console.log('First device example:', response.data[0]);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await axios.delete(`http://localhost:8000/devices/${id}`);
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
        setError('Failed to delete device');
      }
    }
  };

  const handleGroupByChange = (event: any) => {
    setGroupBy(event.target.value);
  };

  const groupDevices = () => {
    if (groupBy === 'none') {
      return { 'All Devices': devices };
    }

    if (groupBy === 'device_type') {
      return devices.reduce((acc, device) => {
        const type = device.device_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(device);
        return acc;
      }, {} as Record<string, Device[]>);
    }

    if (groupBy === 'tags') {
      const grouped: Record<string, Device[]> = {};
      devices.forEach(device => {
        if (device.tags && device.tags.length > 0) {
          device.tags.forEach(tag => {
            if (!grouped[tag]) {
              grouped[tag] = [];
            }
            grouped[tag].push(device);
          });
        } else {
          if (!grouped['No Tags']) {
            grouped['No Tags'] = [];
          }
          grouped['No Tags'].push(device);
        }
      });
      return grouped;
    }

    return { 'All Devices': devices };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const groupedDevices = groupDevices();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Network Devices
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: 'white' }}>Group By</InputLabel>
          <Select
            value={groupBy}
            onChange={handleGroupByChange}
            label="Group By"
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '.MuiSvgIcon-root': {
                color: 'white',
              },
            }}
          >
            <MenuItem value="none">No Grouping</MenuItem>
            <MenuItem value="device_type">Device Type</MenuItem>
            <MenuItem value="tags">Tags</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {Object.entries(groupedDevices).map(([group, groupDevices]) => (
        <Box key={group} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            {group} ({groupDevices.length})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No devices found
                    </TableCell>
                  </TableRow>
                ) : (
                  groupDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.ip_address}</TableCell>
                      <TableCell>{device.device_type}</TableCell>
                      <TableCell>
                        {new Date(device.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {device.tags?.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => navigate(`/devices/${device.id}/edit`)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(device.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Container>
  );
};

export default DeviceList;