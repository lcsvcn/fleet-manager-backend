const express = require("express");
const app = express();
const port = 3100;

const cors = require("cors");

app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

let fleetData = {};
let clientData = [];

app.get('/api/v1/fleets', (req, res) => {
  const { owner_email } = req.headers;

  if (!owner_email) {
    return res.status(400).json({ error: "Bad Request: Owner_email not provided" });
  }

  const userFleetData = fleetData[owner_email] || [];
  const fleetsWithNumberDrones = userFleetData.map((fleet) => ({
    ...fleet,
    number_drones: fleet.drones.length,
  }));

  return res.status(200).json(fleetsWithNumberDrones);
});

app.post("/api/v1/fleets", (req, res) => {
  const newFleet = req.body;

  if (!newFleet || !newFleet.fleet_id || !newFleet.fleet_name || !newFleet.owner_email) {
    return res.status(400).json({ error: "Bad Request: Invalid or missing data" });
  }

  const userFleetData = fleetData[newFleet.owner_email] || [];
  const existingFleet = userFleetData.find((fleet) => fleet.fleet_id === newFleet.fleet_id);

  if (existingFleet) {
    return res.status(409).json({ error: "Conflict: Fleet ID already exists for this owner" });
  }

  newFleet.drones = [];
  userFleetData.push(newFleet);
  fleetData[newFleet.owner_email] = userFleetData; // Update fleetData for the owner_email
  return res.status(200).json(newFleet);
});

app.get('/api/v1/fleet/:id', (req, res) => {
  const { id } = req.params;
  const { owner_email } = req.headers;

  const foundFleet = fleetData[owner_email] && fleetData[owner_email].find((fleet) => fleet.fleet_id === id);

  if (foundFleet) {
    return res.status(200).json(foundFleet);
  } else {
    return res.status(404).json({ error: 'Fleet not found' });
  }
});

app.get('/api/v1/fleet/:id/drones', (req, res) => {
  const { id } = req.params;
  const { owner_email } = req.headers;

  const foundFleet = fleetData[owner_email] && fleetData[owner_email].find((fleet) => fleet.fleet_id === id);

  if (foundFleet) {
    return res.status(200).json(foundFleet.drones);
  } else {
    return res.status(404).json({ error: 'Fleet not found' });
  }
});

app.post("/api/v1/fleet/:id/drones", (req, res) => {
  const { id } = req.params;
  const { owner_email } = req.headers;
  const newDrone = req.body;

  const foundFleet = fleetData[owner_email] && fleetData[owner_email].find((fleet) => fleet.fleet_id === id);

  if (!foundFleet) {
    return res.status(404).json({ error: 'Fleet not found' });
  }

  if (!newDrone || !newDrone.drone_id || !newDrone.drone_name || newDrone.owner_email !== owner_email) {
    return res.status(400).json({ error: "Bad Request: Invalid or missing data, or incorrect owner_email" });
  }

  const existingDrone = foundFleet.drones.find((drone) => drone.drone_id === newDrone.drone_id);
  if (existingDrone) {
    return res.status(409).json({ error: "Conflict: Drone ID already exists in the fleet" });
  }

  foundFleet.drones.push(newDrone);
  return res.status(200).json(newDrone);
});

app.get('/api/v1/clients', (req, res) => {
  const clientsWithCounts = clientData.map((client) => {
    const clientFleets = fleetData[client.client_email] || [];
    const numberFleets = clientFleets.length;
    
    const numberDrones = clientFleets.reduce((acc, fleet) => acc + fleet.drones.length, 0);

    return {
      ...client,
      number_fleets: numberFleets,
      number_drones: numberDrones,
    };
  });

  return res.status(200).json(clientsWithCounts);
});

app.post("/api/v1/clients", (req, res) => {
  const { client_email, client_password, first_name, last_name } = req.body;

  if (!client_email || !client_password || !first_name || !last_name) {
    return res.status(400).json({ error: "Bad Request: Invalid or missing data" });
  }

  const existingClient = clientData.find(
    (client) => client.client_email === client_email
  );
  
  if (existingClient) {
    return res.status(409).json({ error: "Conflict: Client Email already exists" });
  }

  const newClient = { client_email, client_password, first_name, last_name };
  clientData.push(newClient);
  return res.status(200).json(newClient);
});

app.post('/api/v1/login', (req, res) => {
  const { client_email, client_password } = req.body;

  const foundClient = clientData.find((client) => client.client_email === client_email);

  if (!foundClient) {
    return res.status(404).json({ error: 'Client not found' });
  }

  if (foundClient.client_password !== client_password) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  return res.status(200).json({ message: 'Login successful' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});