import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const roles = ['Director', 'Anchor', 'STO', 'Prompter', 'Producer'];

export default function Login() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const login = () => {
    if (!role) return;
    localStorage.setItem('role', role);
    socket.emit('join-role', role);
    navigate('/dashboard');
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl">Select Role</h1>
      <select onChange={e => setRole(e.target.value)} className="bg-gray-900 p-3 text-white">
        <option value="">Choose</option>
        {roles.map(r => <option key={r}>{r}</option>)}
      </select>
      <button onClick={login} className="bg-white text-black px-6 py-2">ENTER</button>
    </div>
  );
}