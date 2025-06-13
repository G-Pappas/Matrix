import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import DeviceList from './components/DeviceList';
import DeviceForm from './components/DeviceForm';
import DeviceDetails from './components/DeviceDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/devices/new" element={<DeviceForm />} />
          <Route path="/devices/:id" element={<DeviceDetails />} />
          <Route path="/devices/:id/edit" element={<DeviceForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 