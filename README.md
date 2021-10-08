# tumblr-clone-server

Backend for a fullstack tumblr clone.

Built using Typescript, TypeOrm, type-graphql and apollo-server-express. 
* [Installation](#user-content-installation)
* [Usage](#user-content-usage)

## Installation

1. Clone project

```bash
git clone https://github.com/prajotsurey/tumblr-clone-server.git
```

2. Install dependencies for API server.

```bash
npm install
```

4. Start PostgreSQL server
5. Create database named 'tumblr'
6. Add a user with the username `postgres` and password `password`
7. Create a .env file with the following data
```
ACCESS_TOKEN_SECRET=<string>
REFRESH_TOKEN_SECRET=<string>
PORT=<string>
NODE_ENV=development
DATABASE_URL=postgres://postgres:password@localhost:5432/tumblr
CORS_ORIGIN=<url for your frontend>
```
## Usage

1. Build to tsc

```bash
npm run watch
```

2. Start server

In a separate terminal
```bash
npm run dev
```
