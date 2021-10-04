module.exports = {
  "name": "default",
  "type": "postgres",
  "host": "db",
  "username": "postgres",
  "password": "password",
  "database": "tumblr",
  "port": 5432,
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