router.get('/:room?page=1&limit=20', async (req, res) => {
  const { room } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const messages = await Message.find({ room })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(messages.reverse());
});
