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
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleGroupByChange = (event: SelectChangeEvent<GroupByOption>) => {
    setGroupBy(event.target.value as GroupByOption);
    setSelectedTag(null); // Reset selected tag when changing group by option
  };

  const handleTagClick = (tag: string) => {
    setGroupBy('tags');
    setSelectedTag(tag);
  };

  const filteredDevices = devices.filter(device => {
    const searchLower = searchQuery.toLowerCase();
    return (
      device.name.toLowerCase().includes(searchLower) ||
      device.ip_address.toLowerCase().includes(searchLower) ||
      device.device_type.toLowerCase().includes(searchLower) ||
      device.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const groupedDevices = groupBy === 'none' 
    ? { 'All Devices': filteredDevices }
    : groupBy === 'device_type'
    ? filteredDevices.reduce((acc, device) => {
        const type = device.device_type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(device);
        return acc;
      }, {} as Record<string, Device[]>)
    : filteredDevices.reduce((acc, device) => {
        device.tags.forEach(tag => {
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(device);
        });
        return acc;
      }, {} as Record<string, Device[]>);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Network Devices
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'white' }}>Group By</InputLabel>
            <Select
              value={groupBy}
              label="Group By"
              onChange={handleGroupByChange}
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
          <TextField
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              minWidth: 300,
              '& .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiInputLabel-root': {
                color: 'white'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/devices/new')}
          >
            Add Device
          </Button>
        </Box>
      </Box>
      
      {/* Clear Filters button above the device list, visible when groupBy is not 'none' */}
      {groupBy !== 'none' && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setSelectedTag(null);
              setGroupBy('none');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        Object.entries(groupedDevices).map(([group, groupDevices]) => (
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
                                onClick={() => handleTagClick(tag)}
                                sx={{ 
                                  cursor: 'pointer',
                                  backgroundColor: 'transparent',
                                  border: '1px solid',
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '& .MuiChip-label': {
                                      color: 'white'
                                    }
                                  }
                                }}
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
        ))
      )}
    </Container>
  );
};

export default DeviceList;