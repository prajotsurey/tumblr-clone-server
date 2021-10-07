module.exports = {
  "name": "default",
  "type": "postgres",
  "host": process.env.NODE_ENV === 'development' ? 'localhost' : 'db',
  "username": process.env.POSTGRES_USER,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DB,
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