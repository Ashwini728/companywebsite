const Event = require('../models/Event');
const Match = require('../models/Match');

// Register Player
exports.registerPlayer = async (req, res) => {
  const { eventName, playerName, contact } = req.body;

  try {
    let event = await Event.findOne({ eventName });

    if (!event) {
      event = new Event({ eventName, participants: [] });
    }

    event.participants.push({ playerName, contact, paymentStatus: true });
    await event.save();

    res.status(200).json({ message: 'Player Registered Successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Generate Match Table
exports.getMatchTable = async (req, res) => {
  const { eventName } = req.query;

  const event = await Event.findOne({ eventName });
  const players = event.participants;

  const matches = [];

  for (let i = 0; i < players.length; i += 2) {
    if (players[i + 1]) {
      matches.push({
        player1: players[i].playerName,
        player2: players[i + 1].playerName,
        contactLink: `mailto:${players[i].contact}`,
      });
    }
  }

  res.status(200).json(matches);
};
