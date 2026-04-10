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
      if (navigator.vibrate && enabled) navigator.vibrate(300);
      setTimeout(() => setIncoming(null), 3000);
    };

    socket.on('incoming-call', handleIncoming);

    return () => socket.off('incoming-call', handleIncoming);
  }, [enabled]);

  const callRole = (role) => socket.emit('call-role', role);

  const enableAlerts = () => {
    navigator.vibrate?.(1);
    setEnabled(true);
  };

  // ✅ filter out current role
  const filteredRoles = roles.filter(
    (r) => r.toLowerCase() !== currentRole?.toLowerCase()
  );

  return (
    <div className="h-screen bg-[#0a0a0a] text-white p-6">
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

      {incoming && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-4xl mb-4 animate-pulse">📳 {incoming}</h1>
            <p className="text-gray-400">is buzzing</p>
          </div>
        </div>
      )}
    </div>
  );
}