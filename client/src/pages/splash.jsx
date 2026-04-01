import React from "react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-7xl font-bold bg-black text-white">
      ERIC!!!
    </div>
  );
}