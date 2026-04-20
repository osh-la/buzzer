import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';

const roles = ['Director', 'Anchor', 'STO', 'Prompter', 'Producer'];

export default function Dashboard() {
  const navigate = useNavigate();

  const currentRole = localStorage.getItem('role');

  const [incoming, setIncoming] = useState(null);
  const [enabled, setEnabled] = useState(false);

  // redirect if no role
  useEffect(() => {
    if (!currentRole) {
      navigate('/login');
    }
  }, [currentRole, navigate]);

  // listen for incoming calls
  useEffect(() => {
    const handleIncoming = ({ from }) => {
      setIncoming(from);

      // 🔊 better vibration pattern
      if (navigator.vibrate && enabled) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }

      // ⏳ stay longer
      setTimeout(() => setIncoming(null), 5000);
    };

    socket.on('incoming-call', handleIncoming);

    return () => socket.off('incoming-call', handleIncoming);
  }, [enabled]);

  const callRole = (role) => socket.emit('call-role', role);

  const enableAlerts = () => {
    navigator.vibrate?.(50);
    setEnabled(true);
  };

  // filter out current role
  const filteredRoles = roles.filter(
    (r) => r.toLowerCase() !== currentRole?.toLowerCase()
  );

  return (
    <div className="h-screen bg-[#0a0a0a] text-white p-6">
      
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg">
          ROLE: <span className="font-bold">{currentRole}</span>
        </h1>

        {!enabled && (
          <button
            onClick={enableAlerts}
            className="bg-green-600 px-4 py-2 text-sm rounded"
          >
            Enable Alerts
          </button>
        )}
      </div>

      {/* role buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRoles.map((r) => (
          <button
            key={r}
            onClick={() => callRole(r)}
            className="h-24 bg-[#1a1a1a] hover:bg-blue-600 transition text-lg font-semibold rounded-xl"
          >
            {r}
          </button>
        ))}
      </div>

      {/* 🔥 INCOMING POPUP */}
      {incoming && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/70 animate-fadeIn" />

          {/* popup */}
          <div className="relative bg-[#111] px-8 py-6 rounded-2xl shadow-2xl text-center animate-scaleIn">
            
            <h1 className="text-3xl font-bold mb-2 animate-bounce">
              📳 {incoming.toUpperCase()}
            </h1>

            <p className="text-gray-300 text-lg">
              buzzing
            </p>

          </div>
        </div>
      )}
    </div>
  );
}