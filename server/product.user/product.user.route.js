import express from 'express';
import httpStatus from 'http-status';
import * as productUserCtrl from './product.user.controller';
import log from '../../libs/logger';
import { genUserVerification } from '../helper/utils';


const router = express.Router();

/**
 *
 * @param {String} id
 * @param {Function} res401
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * callback function helps verify user
 */
function verificationFunction(req, res401, next, id, res) {
  const baseUrlPattern = /^\/api\/products\/users\/?$/;
  const { method, originalUrl } = req;
  if (baseUrlPattern.test(originalUrl)) return res401();
  if (method === 'DELETE') {
    log.warning(`UserId: ${id} called an unauthorized API: ${originalUrl}`);
    return res401();
  }

  let userId = originalUrl.match(/[a-f\d]{24}/);
  userId = userId && userId[0];

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid user id' });
  }
  if (userId !== id) {
    log.warning(`UserId: ${id} called an unauthorized API: ${originalUrl}`);
    return res401();
  }

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
  .get(productUserCtrl.list)
  .post(productUserCtrl.create);

/**
 * Get a single user
 */
router.route('/:userId')
  .get(productUserCtrl.get)
  .put(productUserCtrl.update)
  .delete(productUserCtrl.remove);

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', productUserCtrl.load);

export default router;