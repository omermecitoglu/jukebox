![Jukebox Logo](https://github.com/omermecitoglu/jukebox-client/blob/main/public/apple-icon-180x180.png)


# Jukebox Server

Welcome to the Jukebox Server project! This server-side application is the backbone of the Jukebox music streaming service. It provides the backend functionality for managing users, playlists, and streaming music from YouTube. This README file will help you understand how to set up and use the server project.

## Prerequisites

Before you begin, make sure you have the following software and dependencies set up:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/omermecitoglu/jukebox-server.git
   cd jukebox-server
   ```

2. Set up Redis using Docker:

   The project includes a `docker-compose.yml` file for setting up a Redis container. Run the following command to start Redis:

   ```bash
   docker-compose up -d
   ```

## Configuration

The Jukebox Server does not require a separate `.env` file for configuration since it relies on the provided Docker Compose file for Redis.

## Available Scripts

In the project directory, you can run the following scripts:

- **Development Mode**:

  ```bash
  npm run dev
  ```

  This command starts the server in development mode. By default, it runs on port 3001, but you can change the port in your code if needed.

- **Production Mode**:

  ```bash
  npm start
  ```

  This command starts the server in production mode. Make sure to set the `NODE_ENV` environment variable to "production" in your deployment environment.

## Dependencies

Here are some of the key dependencies used in this project:

- **Express** - A web application framework for building robust APIs.
- **Socket.io** - A library for enabling real-time communication with the Jukebox client.

## Additional Information

The Jukebox Server is a crucial component of the Jukebox application. It works in conjunction with the Jukebox client to provide a seamless music streaming experience.

If you have any questions or encounter any issues, please don't hesitate to reach out. For more information on setting up and running the Jukebox client, refer to the README file in the client project.

Thank you for using the Jukebox Server! We hope you enjoy building and using this music streaming service. 🎵🎧
