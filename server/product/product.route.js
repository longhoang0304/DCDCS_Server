import express from 'express';
import User from '../user/user.model';
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
async function verificationFunction(req, res401, next) {
  const { method, originalUrl } = req;
  const productId = originalUrl.match(/[a-f\d]{24}/);
  if (!productId) return res401();
  if (!await User.isContainsProduct(productId)) return res401();
  if (method === 'DELETE') return res401();
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
router.route('/:productId')
  .get(productCtrl.get)
  .put(productCtrl.update)
  .delete(productCtrl.remove);

/**
 * Load user when API with userId route parameter is hit
 */
router.param('productId', productCtrl.load);

export default router;