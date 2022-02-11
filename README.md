# Tumblr clone server built with Typescript, Apollo-express-server, PSQL and Graphql. [Website](https://tumblr-clone-client.vercel.app/)

This project is the backend for a fullstack tumblr clone.

[Frontend repository](https://github.com/prajotsurey/tumblr-clone-client)

## Overview
This project is part of a Fullstack reddit clone. It includes functionality to create a user, create a post, view posts, like and unlike posts and deleting posts.

It uses GraphQl with apollo-server-express and also uses PostgreSQL as the database. I also used dataloaders, which are a graphQl tool for batching requets. It allowed me to avoid the n+1 problem while fetching posts and their creators.

This server is deployed on AWS Elastic Beanstalk and usese AWS Load Balancers and AWS Cloudfront to provide SSL which is required to communicate with the frontend.


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
