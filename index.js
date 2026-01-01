import express from 'express'
import { connectionDB } from './db-connection.js';

const app = express();
const PORT = process.env.PORT || 3000;
import eventsRoutes from "./modules/event/event.router.js"
import nudgeRoutes from "./modules/nudge/nudge.router.js"
import CONFIG from './config/config.js';


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectionDB()

app.use(`${CONFIG.BASEURL}/events`, eventsRoutes);
app.use(`${CONFIG.BASEURL}/nudges`, nudgeRoutes);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express + MongoDB API' });
});

// API Routes

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoClient.close();
  process.exit(0);
});
