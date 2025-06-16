import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import DeviceList from './components/DeviceList';
import DeviceForm from './components/DeviceForm';
import DeviceDetails from './components/DeviceDetails';
import ControlPanel from './pages/ControlPanel';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }
              }}
            >
              Network Manager
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }
              }}
            >
              Devices
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/control-panel"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }
              }}
            >
              Control Panel
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/devices/new" element={<DeviceForm />} />
          <Route path="/devices/:id" element={<DeviceDetails />} />
          <Route path="/devices/:id/edit" element={<DeviceForm />} />
          <Route path="/control-panel" element={<ControlPanel />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;