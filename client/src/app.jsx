import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/splash';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}