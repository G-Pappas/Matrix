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
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';

interface DeviceFormData {
  name: string;
  ip_address: string;
  device_type: string;
  tags: string[];
}

interface DeviceResponse extends DeviceFormData {
  id: number;
  created_at: string;
}

interface DeviceType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

const DeviceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    ip_address: '',
    device_type: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch device types
        const typesResponse = await axios.get('http://localhost:8000/device-types/');
        setDeviceTypes(typesResponse.data);

        // Fetch existing tags
        const devicesResponse = await axios.get('http://localhost:8000/devices/');
        const allTags = devicesResponse.data
          .flatMap((device: DeviceResponse) => device.tags || [])
          .filter((tag: string, index: number, self: string[]) => self.indexOf(tag) === index);
        setExistingTags(allTags);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchDevice = async () => {
        try {
          const response = await axios.get<DeviceResponse>(`http://localhost:8000/devices/${id}`);
          setFormData({
            name: response.data.name,
            ip_address: response.data.ip_address,
            device_type: response.data.device_type,
            tags: response.data.tags || [],
          });
        } catch (error) {
          console.error('Error fetching device:', error);
        }
      };
      fetchDevice();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete),
    }));
  };

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
              {deviceTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleTagDelete(tag)}
                />
              ))}
            </Stack>
            <Autocomplete
              freeSolo
              options={existingTags}
              value={tagInput}
              onChange={(_, newValue) => {
                if (newValue && !formData.tags.includes(newValue)) {
                  setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newValue],
                  }));
                }
                setTagInput('');
              }}
              inputValue={tagInput}
              onInputChange={(_, newInputValue) => setTagInput(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Add Tag"
                  onKeyPress={handleTagInputKeyPress}
                />
              )}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {id ? 'Save Changes' : 'Add Device'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DeviceForm;