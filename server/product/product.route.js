import express from 'express';
import * as productCtrl from './product.controller';
import { genUserVerification } from '../helper/utils';

const router = express.Router();

/**
 *
 * @param {Function} res401
 * @param {Request} req
 * @param {Function} next
 * callback function helps verify user
 */
function verificationFunction(req, res401, next) {
  const { method } = req;
  if (method !== 'GET') return res401();
  return next();
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * Middleware helps verrify user
 */
const verifyUser = genUserVerification(verificationFunction);
router.use(verifyUser);

/**
 * List all users
 */
router.route('/')
  .get(productCtrl.list)
  .post(productCtrl.create);

/**
 * Get a single user
 */
router.route('/:userId')
  .get(productCtrl.get)
  .put(productCtrl.update)
  .delete(productCtrl.remove);

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', productCtrl.load);

export default router;