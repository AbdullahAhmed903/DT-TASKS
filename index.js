import express from 'express'
import { connectionDB } from './db-connection.js';

const app = express();
const PORT = process.env.PORT || 3000;
import eventsRoutes from "./modules/event/event.router.js"
import nudgeRoutes from "./modules/nudge/nudge.router.js"
import CONFIG from './config/config.js';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectionDB()

app.use(`${CONFIG.BASEURL}/events`, eventsRoutes);
app.use(`${CONFIG.BASEURL}/nudges`, nudgeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express + MongoDB API' });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


