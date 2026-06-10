Python WebSocket User Management Service

Overview
The objective of this project is to build a small Python-based service that uses several technologies and patterns used within our development.

The application should host a WebSocket server that accepts messages from connected clients and performs operations against a User database stored in SQLite. The service should be packaged and deployed within a Docker container.

Functional Requirements
The service should support:

- Creating a user
- Deleting a users
- Listing all users

Communication between the client and the sever should take place via WebSocket messages using a structured JSON format:
{
  "operation": "create_user",
  "data": {
    "name": "Ollie"
  }
}

Technical Requirements
Python
Build the application using Python and organise the code into logical layers. Consider separating responsibilities such as :

- WebSocket communication
- Business logic / orchestration
- Data access
- Database config
- Data models

For example:
src/
├── websocket/
│ └── server.py
├── service/
│ └── user_service.py
├── repository/
│ └── user_repository.py
├── model/
│ └── user.py
├── database/
│ └── sqlite.py
└── main.py

Database
Use SQLite for persistance.

Use SQLAlchemy for database interaction rather than writing raw SQL where possible.

Containerisation
Create a Docker image for the application.

The application should be runnable using Docker and expose the WebSocket server to clients.

Technologies to explore
Before starting development, brush up on:
Docker
Images
Containers
Dockerfiles
Port mapping
Volumes
Python 'websockets' library
Using the CLI included to connect to your server for runtime testing
SQLAlchemy
Models
Sessions
CRUD operations

Using AI
Use AI throughout this project! Give it this spec, ask it where to start, and prompt Co-pilot to help you through implementation. Treat it's responses as guidance - make sure you understand the code being produced.

Create a Python application which runs a WebSocket server and handles messages to perform operations on Users stored in a SQLite database. Build a Docker image containing this application, which runs as a container to host the Server.