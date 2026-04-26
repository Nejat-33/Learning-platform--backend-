import express from 'express';
import { getResources, removeResource, addResource } from '../controllers/resource.controller.js';
import upload from '../middlewares/multer.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import rolevalidate from '../middlewares/role.middleware.js';

const Rerouter = express.Router();

Rerouter.get('/', getResources);


Rerouter.post('/', upload.single('image'), addResource);
Rerouter.delete('/:id', authenticate , rolevalidate('admin'), removeResource);

export default Rerouter;