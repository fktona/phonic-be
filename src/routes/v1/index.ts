import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import agentRoute from './agents.route';
import config from '../../config/config';
import battleRoute from './battle.route';
import marketCapRoute from './market-cap.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/market-cap',
    route: marketCapRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/agents',
    route: agentRoute
  },
  {
    path: '/battles',
    route: battleRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
