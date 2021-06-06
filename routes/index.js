import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();
/*  Views */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.disconnect);
router.get('/users/me', UsersController.getMe);

router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

export default router;
