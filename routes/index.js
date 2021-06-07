import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import auth from '../middleware/auth';

const router = express.Router();
/*  Views */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', auth, AuthController.getDisconnect);
router.get('/users/me', auth, UsersController.getMe);

router.post('/files', FilesController.postUpload);

router.get('/files/:id', auth, FilesController.getShow);
router.get('/files', FilesController.getIndex);

router.put('/files/:id/publish', auth, FilesController.putPublish);
router.put('/files/:id/unpublish', auth, FilesController.putUnpublish);

export default router;
