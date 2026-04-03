const randomJokeBtn = document.getElementById('random-joke-btn');
const randomJokeOutput = document.getElementById('random-joke-output');
const loadCategoriesBtn = document.getElementById('load-categories-btn');
const categoryList = document.getElementById('category-list');
const categorySearchForm = document.getElementById('category-search-form');
const categoryInput = document.getElementById('category-input');
const limitInput = document.getElementById('limit-input');
const categoryJokesOutput = document.getElementById('category-jokes-output');
const addJokeForm = document.getElementById('add-joke-form');
const formMessage = document.getElementById('form-message');

function renderJoke(joke) {
  return `
    <div class="joke">
      <p><strong>Category:</strong> ${joke.category}</p>
      <p><strong>Setup:</strong> ${joke.setup}</p>
      <p><strong>Delivery:</strong> ${joke.delivery}</p>
    </div>
  `;
}

function renderError(message, container) {
  container.innerHTML = `<p class="error">${message}</p>`;
}

async function loadRandomJoke() {
  try {
    const response = await fetch('/jokebook/random');
    const data = await response.json();

    if (!response.ok) {
      renderError(data.error || 'Could not load random joke.', randomJokeOutput);
      return;
    }

    randomJokeOutput.innerHTML = renderJoke(data.joke);
  } catch (error) {
    renderError('Server error while loading random joke.', randomJokeOutput);
  }
}

async function loadCategories() {
  try {
    const response = await fetch('/jokebook/categories');
    const data = await response.json();

    if (!response.ok) {
      categoryList.innerHTML = '<li>Could not load categories.</li>';
      return;
    }

    categoryList.innerHTML = '';

    data.categories.forEach((categoryObj) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = categoryObj.name;
      button.addEventListener('click', () => loadCategoryJokes(categoryObj.name));
      li.appendChild(button);
      categoryList.appendChild(li);
    });
  } catch (error) {
    categoryList.innerHTML = '<li>Server error while loading categories.</li>';
  }
}

async function loadCategoryJokes(category, limit = '') {
  try {
    let url = `/jokebook/category/${encodeURIComponent(category)}`;
    if (limit) {
      url += `?limit=${encodeURIComponent(limit)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      renderError(data.error || 'Could not load category jokes.', categoryJokesOutput);
      return;
    }

    if (data.jokes.length === 0) {
      categoryJokesOutput.innerHTML = '<p>No jokes found in this category.</p>';
      return;
    }

    categoryJokesOutput.innerHTML = data.jokes.map(renderJoke).join('');
  } catch (error) {
    renderError('Server error while loading category jokes.', categoryJokesOutput);
  }
}

categorySearchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const category = categoryInput.value.trim();
  const limit = limitInput.value.trim();

  if (!category) {
    renderError('Please enter a category name.', categoryJokesOutput);
    return;
  }

  await loadCategoryJokes(category, limit);
});

addJokeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const category = document.getElementById('new-category').value.trim();
  const setup = document.getElementById('new-setup').value.trim();
  const delivery = document.getElementById('new-delivery').value.trim();

  try {
    const response = await fetch('/jokebook/joke/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, setup, delivery })
    });

    const data = await response.json();

    if (!response.ok) {
      formMessage.textContent = data.error || 'Could not add joke.';
      return;
    }

    formMessage.textContent = 'Joke added successfully.';
    categoryJokesOutput.innerHTML = data.jokes.map(renderJoke).join('');
    addJokeForm.reset();
  } catch (error) {
    formMessage.textContent = 'Server error while adding joke.';
  }
});

randomJokeBtn.addEventListener('click', loadRandomJoke);
loadCategoriesBtn.addEventListener('click', loadCategories);
window.addEventListener('DOMContentLoaded', loadRandomJoke);
