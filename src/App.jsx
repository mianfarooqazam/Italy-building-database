import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BuildingDetails from './pages/BuildingDetails';
import Certificate from './pages/Certificate';
import EnergyBill from './pages/EnergyBill';
import AIComponent from './pages/AIComponent';
import Co2Emissions from './pages/Co2Emissions';
import Comparison from './pages/Comparison'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="flex overflow-x-hidden">
          <Sidebar />
          <div className="flex-1 bg-[#fff] ml-64 min-h-screen p-4 overflow-x-hidden">
        
            <Routes>
              {/* Redirect root path '/' to '/dashboard' */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* Define Dashboard at '/dashboard' */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Other Routes */}
              <Route path="/building-details" element={<BuildingDetails />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/energy-bill" element={<EnergyBill />} />
              <Route path="/co2-emissions" element={<Co2Emissions />} />
              <Route path="/ai-component" element={<AIComponent />} />
              <Route path="/comparison" element={<Comparison />} /> {/* Add the new route */}

              {/* Redirect any unknown routes to Dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;