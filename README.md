# LeetCode Practice Buddy: Your daily companion for coding interview prep!

This app sends you 3 carefully selected coding problems each day from LeetCode's [Top 150](https://leetcode.com/studyplan/top-interview-150/) interview questions. It uses smart repetition to help you remember solutions better - just like how you'd learn flashcards, but for coding problems!
Built with React, Node.js, and MongoDB, the app runs smoothly in Docker containers so you can set it up with minimal hassle.
Get your daily dose of coding practice and ace those technical interviews! 🚀

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository to your local machine.

2. Navigate to the project root directory.

3. Build and start the containers:

   ```
   docker compose up --build
   ```

   This command will start three containers:
   - Frontend (React app)
   - Backend (Node.js server)
   - MongoDB

   The frontend will be accessible at `http://localhost:3721`.

### Initializing the Database

After the containers are up and running, you need to initialize the database with some data. We provide two scripts for this purpose:

1. Initialize user statistics:

   ```
   docker compose exec backend node init_stats.js
   ```

   This script will create initial statistics for a user in the database.

2. Populate practice questions:

   ```
   docker compose exec backend node prepare_questions.js
   ```

   This script will populate the database with a set of practice questions.

## Development

For development, the Docker setup mounts the source code directories as volumes. This means you can make changes to the code on your host machine, and the changes will be reflected in the running containers.

## Stopping the Application

To stop the application and remove the containers, use:
    ```
    docker compose down
    ```
