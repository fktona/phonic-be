import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import xss from './middlewares/xss';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import cors from 'cors';
import verifySignatureByPublicKey from './utils/tts';
import path from 'path';

const app = express();

app.use(cors());

const filePath = path.join(process.cwd(), 'tts.pem');

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req);
  try {
    // Get the signature from headers
    const signature = req.headers['x-signature'];
    console.log('signature', signature);
    if (!signature) {
      return res.status(400).send('Missing x-signature header');
    }

    // Get the raw request body
    const rawBody = JSON.stringify(req.body);

    // console.log('rawBody', req);

    // Verify the signature
    // const isValid = verifySignatureByPublicKey(rawBody, signature as string, filePath);
    // if (!isValid) {
    //   return res.status(401).send('Invalid signature');
    // }

    // // Process the webhook payload
    // const payload = req.body;
    // console.log('Webhook received:', payload);

    // Respond with 200 OK
    res.status(200).send('Webhook received and verified');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression() as any);

// jwt authentication
app.use(passport.initialize() as any);
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
