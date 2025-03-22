import express, { Express } from 'express';
import logger from './lib/logger';
import morgan from 'morgan';
import { errorMiddleware, middleware404 } from './middleware/error.middleware';
import setupCors from './lib/cors';
import passport from './strategies/passport.strategy';
import cookieParser from 'cookie-parser';
import http from 'http';

//import routes 
import authController from './routes/auth/auth.controller';
import usersController from './routes/users/users.controller';
import followersController from './routes/followers/followers.controller';
import { authenticate } from './middleware/auth.middleware';
import { SocketApp } from './sockets';

const app: Express = express();
const port = process.env.PORT || 8001;

const server = http.createServer(app);
SocketApp.setupSockets(server);



//setup appplication
app.use(
    morgan("combined", {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(setupCors());
app.use(passport.initialize());


//setup route
app.get('/', (req, res) => {
  res.send('Hello World!');
})
app.use('/api/auth/', authController);
app.use('/api/users/', authenticate,usersController);
app.use('/api/followers/', authenticate,followersController);


//setup middleware
app.use(errorMiddleware);
app.use(middleware404);


server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

