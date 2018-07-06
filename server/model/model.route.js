import express from 'express';
import * as modelCtrl from './model.controller';
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
 * List all models
 */
router.route('/')
  .get(modelCtrl.list)
  .post(modelCtrl.create);

/**
 * Get a single model
 */
router.route('/:modelId')
  .get(modelCtrl.get)
  .put(modelCtrl.update)
  .delete(modelCtrl.remove);

/**
 * Load model when API with modelId route parameter is hit
 */
router.param('modelId', modelCtrl.load);

export default router;