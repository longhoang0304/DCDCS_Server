import express from 'express';
import userRoutes from './server/user/user.route';
import productRoutes from './server/product/product.route';
import queueRoutes from './server/queue/message.route';
import authRoutes from './server/auth/auth.route';
import modelRoutes from './server/model/model.route';
import productUserRoutes from './server/product.user/product.user.route';

const router = express.Router(); // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.json({ message: 'OK' }));

// mount user routes at /users
router.use('/users', userRoutes);

// mount products routes at /products
router.use('/products', productRoutes);

// mount products user routes at /products
router.use('/product-users', productUserRoutes);


// mount actions routes at /actions
router.use('/actions', queueRoutes);

// mount authenticate
router.use('/auth', authRoutes);

// mount models
router.use('/models', modelRoutes);

export default router;