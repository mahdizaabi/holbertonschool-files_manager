import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import auth from '../middleware/auth';
import preAuth from '../middleware/preAuth';

const router = express.Router();
/*  Views */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', auth, AuthController.getDisconnect);
router.get('/users/me', auth, UsersController.getMe);

router.post('/files', auth, FilesController.postUpload);

router.get('/files/:id', auth, FilesController.getShow);
router.get('/files', auth, FilesController.getIndex);

router.put('/files/:id/publish', auth, FilesController.putPublish);
router.put('/files/:id/unpublish', auth, FilesController.putUnpublish);

router.get('/files/:id/data', preAuth, FilesController.getFile);

export default router;
