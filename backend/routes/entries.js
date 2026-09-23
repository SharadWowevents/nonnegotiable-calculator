const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

// GET all entries (Formatted as { "YYYY-MM-DD": { data } } for the React frontend)
router.get('/', auth, async (req, res) => {
  try {
    const entriesList = await Entry.find();
    const entriesObj = {};
    
    entriesList.forEach(entry => {
      // Map the MongoDB document array back to the React Date Object structure
      entriesObj[entry.date] = entry;
    });
    
    res.json(entriesObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / Upsert a single day's entry
router.post('/', auth, async (req, res) => {
  const { date, ...data } = req.body;
  if (!date) return res.status(400).json({ error: "Date is required" });

  try {
    // If the entry for this date exists, update it. If not, create it.
    const entry = await Entry.findOneAndUpdate(
      { date },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an entry by date string
router.delete('/:date', auth,async (req, res) => {
  try {
    await Entry.findOneAndDelete({ date: req.params.date });
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Change your existing routes to include the 'auth' middleware:


module.exports = router;