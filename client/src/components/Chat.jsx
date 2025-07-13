import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState('');

  <div className="w-full md:w-1/2 mx-auto p-4">
  {/* Responsive container */}
</div>


  //Listen for new messages and typing events
  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing', (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(''), 3000);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, []);

  //typing
  const handleTyping = () => {
    socket.emit('typing', username);
  };

  //sending messages
  const sendMessage = () => {
    const handleSendMessage = () => {
  const message = {
    text: inputValue,
    room: currentRoom,
    user: username,
  };

  socket.emit('send-message', message, (ack) => {
    console.log('✔️ Delivered:', ack.timestamp);
// Optionally update UI to reflect delivery status
  });

  setInputValue('');
};

    if (message.trim()) {
      socket.emit('message', { user: username, text: message });
      setMessage('');
    }
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {typingUser && <p>{typingUser} is typing...</p>}

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
  