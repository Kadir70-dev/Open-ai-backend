# Project Name

## Overview
This project is a Node.js application that uses the OpenAI API to interact with users. It also stores user messages and responses in a MongoDB database. The project is structured to separate concerns into different modules for better maintainability and scalability. The project uses Express.js for handling HTTP requests, and includes CORS support for cross-origin requests.

## Directory Structure



project-directory/
│
├── src/
│   ├── index.js
│   ├── openaiClient.js
│   ├── assistantService.js
│   ├── routes.js
│   ├── utils.js
│   └── db.js
├── node_modules/
├── package.json
├── package-lock.json
└── README.md


## Files and Their Purpose

### src/index.js
The entry point of the application. It sets up the Express server, enables CORS, and uses the routes defined in `src/routes.js`.

### src/openaiClient.js
Initializes the OpenAI client with the provided API key and exports it for use in other modules.

### src/assistantService.js
Contains functions for interacting with the OpenAI API, such as retrieving the run status and getting assistant instructions. It also saves the assistant's responses to MongoDB.

### src/routes.js
Defines the API endpoints and their handlers. It handles the POST requests to `/api/message`, processes the user input, communicates with the OpenAI API, and saves the messages to MongoDB.

### src/utils.js
Contains utility functions such as `sleep`, which is used to introduce delays.

### src/db.js
Contains the MongoDB client setup and a function to connect to the database.

## Prerequisites
- Node.js installed on your machine
- An OpenAI API key
- MongoDB installed and running locally

## Installation

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd project-directory
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Environment Variables:**
   Update your OpenAI API key in `src/openaiClient.js`:
   ```javascript
   const apiKey = 'your--api-key';
