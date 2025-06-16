import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import DeviceTypeManager from '../components/DeviceTypeManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`control-panel-tabpanel-${index}`}
      aria-labelledby={`control-panel-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ControlPanel = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="control panel tabs">
            <Tab label="Device Types" />
            {/* Add more tabs here as needed */}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <DeviceTypeManager />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ControlPanel; 