const express = require('express');
const router = express.Router();
const jokebookController = require('../controllers/jokebookController');

router.get('/categories', jokebookController.getCategories);
router.get('/category/:category', jokebookController.getCategoryJokes);
router.get('/random', jokebookController.getRandomJoke);
router.post('/joke/add', jokebookController.addJoke);

module.exports = router;
