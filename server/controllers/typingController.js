import User from '../models/User.js';

export const saveTypingData = async (req, res) => {
  const { wpm, accuracy, duration } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    user.typingData.push({ wpm, accuracy, duration });
    await user.save();

    res.status(200).json({ msg: 'Data saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTypingHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    res.status(200).json(user.typingData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
