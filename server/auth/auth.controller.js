/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import User from '../user/user.model';
import ProductUser from '../product.user/product.user.model';

const genLoginFunction = (UserModel) => async (req, res) => {
  const { username, password } = req.body;
  let status = httpStatus.OK;
  let token = '';
  try {
    const user = await UserModel.findByUser(username);
    if (bcrypt.compareSync(password, user.password)) {
      token = user.token; // eslint-disable-line
    } else {
      status = httpStatus.BAD_REQUEST;
    }
    return res.status(status).json({ token });
  } catch (error) {
    status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error.message,
    });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Generate token on login
 */
const login = genLoginFunction(User);

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Generate token on login
 */
const productLogin = genLoginFunction(ProductUser);


export { login, productLogin };