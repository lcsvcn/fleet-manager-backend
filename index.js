const express = require("express");
const app = express();
const port = 3100;

const cors = require("cors");

app.use(express.json());

app.use(cors());

let fleetData = [];

app.get('/api/v1/fleets', (req, res) => {
  const fleetsWithNumberDrones = fleetData.map((fleet) => ({
    ...fleet,
    number_drones: fleet.drones.length,
  }));

  res.json(fleetsWithNumberDrones);
});

app.post("/api/v1/fleets", (req, res) => {
  const newFleet = req.body;

  if (!newFleet || !newFleet.fleet_id || !newFleet.fleet_name) {
    return res.status(400).json({ error: "Bad Request: Invalid or missing data" });
  }

  const existingFleet = fleetData.find((fleet) => fleet.fleet_id === newFleet.fleet_id);
  if (existingFleet) {
    return res.status(409).json({ error: "Conflict: Fleet ID already exists" });
  }

  newFleet.drones = [];
  fleetData.push(newFleet);
  res.status(201).json(newFleet);
});

app.get('/api/v1/fleet/:id', (req, res) => {
  const { id } = req.params;

  const foundFleet = fleetData.find((fleet) => fleet.fleet_id === id);

  if (foundFleet) {
    res.status(200).json(foundFleet);
  } else {
    res.status(404).json({ error: 'Fleet not found' });
  }
});

app.get('/api/v1/fleet/:id/drones', (req, res) => {
  const { id } = req.params;

  const foundFleet = fleetData.find((fleet) => fleet.fleet_id === id);

  if (foundFleet) {
    res.status(200).json(foundFleet.drones);
  } else {
    res.status(404).json({ error: 'Fleet not found' });
  }
});

app.delete("/api/v1/fleets/:fleet_id", (req, res) => {
  const fleetIdToDelete = req.params.fleet_id;
  fleetData = fleetData.filter((fleet) => fleet.fleet_id !== fleetIdToDelete);
  res.json({ message: "Fleet deleted" });
});

app.post("/api/v1/fleet/:id/drones", (req, res) => {
  const { id } = req.params;
  const newDrone = req.body;

  const foundFleet = fleetData.find((fleet) => fleet.fleet_id === id);

  if (!foundFleet) {
    return res.status(404).json({ error: 'Fleet not found' });
  }

  if (!newDrone || !newDrone.drone_id || !newDrone.drone_name) {
    return res.status(400).json({ error: "Bad Request: Invalid or missing data" });
  }

  const existingDrone = foundFleet.drones.find((drone) => drone.drone_id === newDrone.drone_id);
  if (existingDrone) {
    return res.status(409).json({ error: "Conflict: Drone ID already exists in the fleet" });
  }

  foundFleet.drones.push(newDrone);
  res.status(201).json(newDrone);
});

app.delete("/api/v1/fleet/:id/drones/:drone_id", (req, res) => {
  const { id, drone_id } = req.params;

  const foundFleet = fleetData.find((fleet) => fleet.fleet_id === id);

  if (!foundFleet) {
    return res.status(404).json({ error: 'Fleet not found' });
  }

  foundFleet.drones = foundFleet.drones.filter((drone) => drone.drone_id !== drone_id);
  res.json({ message: "Drone deleted from fleet" });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});