import express from 'express';
import { createChat, deleteChat, getChats } from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';

const chatRoutes = express.Router();

chatRoutes.get('/get', protect, getChats);
chatRoutes.post('/create', protect, createChat);
chatRoutes.delete('/delete', protect, deleteChat);

export default chatRoutes;
