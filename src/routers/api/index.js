import express from 'express';
import v1 from './v1';

const apiRouter = express.Router();

apiRouter.use('/v1', v1);

export default apiRouter;
