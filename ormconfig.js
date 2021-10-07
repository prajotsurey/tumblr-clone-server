module.exports = {
  "name": "default",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "password",
  "database": "tumblr",
  "logging": true,
  "entities": ["dist/entities/*.js"],
  "migrations": ["dist/migrations/*.js"] 
  // "name": "default",
  // "type": "postgres",
  // "url" : process.env.DATABASE_URL,
  // "logging": true,
  // "entities": ["dist/entities/*.js"],
  // "migrations": ["dist/migrations/*.js"]
}