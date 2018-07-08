import express from 'express';
import httpStatus from 'http-status';
import * as messageCtrl from './message.controller';
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
  const baseUrlPattern = /^\/api\/actions\/?$/;
  const { method, originalUrl } = req;
  const isBase = baseUrlPattern.test(originalUrl);

  if (isBase && method === 'GET') return res401();
  if (isBase && method === 'POST') {
    const { from } = req.body;
    if (id !== from) {
      return res401();
    }
    return next();
  }

  let productId = originalUrl.match(/[a-f\d]{24}/);
  productId = productId && productId[0];

  if (!productId) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid product id' });
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
 * List all messages
 */
router.route('/')
  .get(messageCtrl.list)
  .post(messageCtrl.create);

/**
 * Get a single message
 */
router.route('/:productId')
  .get(messageCtrl.get);

/**
 * Load message when API with userId route parameter is hit
 */
router.param('productId', messageCtrl.load);

export default router;