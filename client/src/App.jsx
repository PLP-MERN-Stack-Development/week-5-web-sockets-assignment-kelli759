import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Login from './components/Login';
import { useSocket } from './socket';

function App() {
  const [username, setUsername] = useState('');
  const {
    connect,
    disconnect,
    messages,
    users,
    sendMessage,
    isConnected,
    typingUsers
  } = useSocket();

  useEffect(() => {
    if (username) {
      connect(username);
    }

    return () => disconnect();
  }, [username]);

  if (!username) {
    return <Login setUsername={setUsername} />;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>KIKI App</h1>
      <p>Hello and welcome to KIKI App, your best messaging app</p>
      <h2>Hello & welcome, {username}</h2>
      <p>{isConnected ? '🟢 Online' : '🔴 Offline'}</p>

      <h3>Users Online:</h3>
      <ul>
        {users.map((user, i) => (
          <li key={i}>{user}</li>
        ))}
      </ul>

      <h3>Messages:</h3>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.user || msg.from || 'System'}:</strong> {msg.message || msg.text}
          </li>
        ))}
      </ul>

      {/* Add message input + send logic */}
    </>
  );
}

export default App;
