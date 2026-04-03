# webDev-Assignment6

CSC372 Assignment 6: Jokebook.

## What is included
- Node/Express backend
- Postgres connection setup
- MVC-style structure:
  - `models/`
  - `controllers/`
  - `routes/`
- Static frontend in `public/`
- SQL schema and starter data in `db/schema.sql`

## Setup
1. Run `npm install`
2. Create a `.env` file based on `.env.example`
3. Start the server with `npm start`

## Endpoints
- `GET /jokebook/categories`
- `GET /jokebook/category/:category`
- `GET /jokebook/random`
- `POST /jokebook/joke/add`

## Notes
- The POST endpoint currently requires the category to already exist in the database.
- Extra credit with JokeAPI is not included yet.
