import express, { Express } from "express";
import dotenv from "dotenv";
import "./config/db"; 
import cors from "cors";
import indexRouter from "./routes/index";
import cookieParser from 'cookie-parser';
import loggerMiddleware from "./middlewares/logger";
import http from 'http';
import { initializeSocket } from './services/socket';

dotenv.config(); 
const port = process.env.PORT || 8080; 
const app: Express = express();

app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(loggerMiddleware);

const server = http.createServer(app);
initializeSocket(server); 

app.get('/', (req, res) => {
  res.send('Welcome to Social Media - Express API!');
});

app.use('/api', indexRouter); 

app.use((req, res, next) => {
  res.status(404).json({ resStatus: false, resMsg: `[${req.method}] on [${req.path}] Prohibited` });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
