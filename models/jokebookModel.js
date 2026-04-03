"use strict";
const pool = require('./dbConnection');

async function getAllCategories() {
  const result = await pool.query('SELECT name FROM categories ORDER BY name;');
  return result.rows;
}

async function getJokesByCategory(category, limit) {
  const categoryQuery = await pool.query(
    'SELECT id, name FROM categories WHERE name = $1;',
    [category]
  );

  if (categoryQuery.rows.length === 0) {
    return null;
  }

  let query = `
    SELECT j.id, c.name AS category, j.setup, j.delivery
    FROM jokes j
    JOIN categories c ON j.category_id = c.id
    WHERE c.name = $1
    ORDER BY j.id
  `;

  const values = [category];

  if (limit) {
    query += ' LIMIT $2';
    values.push(limit);
  }

  const result = await pool.query(query, values);
  return result.rows;
}

async function getRandomJoke() {
  const result = await pool.query(`
    SELECT j.id, c.name AS category, j.setup, j.delivery
    FROM jokes j
    JOIN categories c ON j.category_id = c.id
    ORDER BY RANDOM()
    LIMIT 1;
  `);

  return result.rows[0];
}

async function addJoke(category, setup, delivery) {
  const categoryQuery = await pool.query(
    'SELECT id FROM categories WHERE name = $1;',
    [category]
  );

  if (categoryQuery.rows.length === 0) {
    return null;
  }

  const categoryId = categoryQuery.rows[0].id;

  await pool.query(
    'INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3);',
    [categoryId, setup, delivery]
  );

  const updatedResult = await pool.query(`
    SELECT j.id, c.name AS category, j.setup, j.delivery
    FROM jokes j
    JOIN categories c ON j.category_id = c.id
    WHERE c.name = $1
    ORDER BY j.id;
  `, [category]);

  return updatedResult.rows;
}

module.exports = {
  getAllCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke
};
