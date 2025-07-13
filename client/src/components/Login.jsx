import { useState } from 'react';

const Login = ({ setUsername }) => {
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      setUsername(name);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Join Chat</button>
    </div>
  );
};

export default Login;
