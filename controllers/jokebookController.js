const jokebookModel = require('../models/jokebookModel.js');

async function getCategories(req, res) {
  try {
    const categories = await jokebookModel.getAllCategories();
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

async function getCategoryJokes(req, res) {
  try {
    const category = req.params.category;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    if (req.query.limit && (Number.isNaN(limit) || limit <= 0)) {
      return res.status(400).json({ error: 'Limit must be a positive number.' });
    }

    const jokes = await jokebookModel.getJokesByCategory(category, limit);

    if (!jokes) {
      return res.status(404).json({ error: 'Invalid category.' });
    }

    res.json({ jokes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jokes for category.' });
  }
}

async function getRandomJoke(req, res) {
  try {
    const joke = await jokebookModel.getRandomJoke();
    res.json({ joke });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch random joke.' });
  }
}

async function addJoke(req, res) {
  try {
    const { category, setup, delivery } = req.body;

    if (!category || !setup || !delivery) {
      return res.status(400).json({
        error: 'Missing required fields. category, setup, and delivery are required.'
      });
    }

    const updatedJokes = await jokebookModel.addJoke(category, setup, delivery);

    if (!updatedJokes) {
      return res.status(404).json({ error: 'Invalid category.' });
    }

    res.status(201).json({ jokes: updatedJokes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add joke.' });
  }
}

module.exports = {
  getCategories,
  getCategoryJokes,
  getRandomJoke,
  addJoke
};
