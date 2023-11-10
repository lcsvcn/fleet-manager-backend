# Fleet Manager Backend

Welcome to the Fleet Manager Backend! This Node.js application serves as the backend for the Fleet Manager system, providing API endpoints for managing and monitoring vehicle fleets.

## Getting Started

Follow these instructions to set up and run the backend on your local machine.

### Prerequisites

- Node.js: Make sure you have Node.js version 18 installed. You can download it [here](https://nodejs.org/).
- MongoDB: The backend uses MongoDB as its database. Make sure you have it installed and running. You can download it [here](https://www.mongodb.com/try/download/community).

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/lcsvcn/fleet-manager-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd fleet-manager-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Running the Backend

1. Start the server:

   ```bash
   npm start
   ```

2. The server will run on [http://localhost:3100](http://localhost:3100) by default.

## API Endpoints

- **GET /api/v1/fleets:** Get a list of all fleets.
- **POST /api/v1/fleet:** Add a new fleet.
- **GET /api/v1/fleets/:id:** Get details of a specific fleet.
- **GET /api/v1/fleet/:id/drones:** Get details of a specific drone in a specific fleet.
- **POST /api/v1/fleet/:id/drones:** Update details of a specific drone in a specific fleet.
- **GET /api/v1/clients:** Get a list of all clientes.
- **POST /api/v1/clients:** Add a new clients.
- **POST /api/v1/login:** Check if client exists

Feel free to expand and customize the API endpoints based on your application's requirements.

## Database

The backend uses MongoDB as its database. Make sure to have MongoDB installed and running. You can configure the database connection in the `.env` file.

## Contributing

We welcome contributions! If you find a bug or have a feature request, please [open an issue](https://github.com/lcsvcn/fleet-manager-backend/issues) or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
