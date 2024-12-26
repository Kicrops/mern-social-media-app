# MERN Social Media APP

This is a social media application using the MERN Stack. You can register an account, search and follow users, post, like and comment on posts, edit your profile, posts and comments and some more stuff.

## Technologies Used

- Frontend: React, Vite, Chakra-UI, 
- Backend: Node.js, Express, JWT
- Database: MongoDB

## Getting Started

Follow these instructions to clone the repository and run the project locally.

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Kicrops/mern-social-media-app.git
    ```

2. Navigate to the project directory:
    ```bash
    cd mern-social-media-app
    ```

3. Create a `.env` file in the root directory and add your MongoDB URI, desired port and JWT secret:
    ```plaintext
    MONGO_URI=your_mongodb_uri
    PORT=your_desired_port
    JWT_SECRET=your_jwt_secret
    ```

4. Install the dependencies for both the frontend and backend and set up the build:
    ```bash
    npm run build
    ```

### Running the Application

1. Start the backend server and the frontend development server:
    ```bash
    npm run start
    ```

2. Open your browser and navigate to `http://localhost:{PORT}` to see the application running.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.