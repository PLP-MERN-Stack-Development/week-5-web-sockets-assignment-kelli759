const handleViewMessage = (senderUsername) => {
  socket.emit('message-read', { from: senderUsername });
};

useEffect(() => {
  socket.on('read-receipt', ({ to }) => {
    console.log(`✅ Message read by ${to}`);
  });

  return () => socket.off('read-receipt');
}, []);

{message.isRead && <span className="text-xs text-green-600">✓ 👀</span>}

const handleReact = (messageId, reaction) => {
  socket.emit('reaction', { messageId, reaction });
};

useEffect(() => {
  socket.on('reaction', ({ messageId, reaction, user }) => {
    console.log(`🙈 ${user} reacted to message ${messageId} with ${reaction}`);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), { user, reaction }],
            }
          : msg
      )
    );
  });

  return () => socket.off('reaction');
}, []);

