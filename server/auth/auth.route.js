import express from 'express';
import * as authCtrl from './auth.controller';

const router = express.Router();
router.route('/login')
  .post(authCtrl.login);

router.route('/forgot')
  .post(authCtrl.forgotPassword);

router.route('/login/product')
  .post(authCtrl.productLogin);


export default router;