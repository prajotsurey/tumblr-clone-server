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
}