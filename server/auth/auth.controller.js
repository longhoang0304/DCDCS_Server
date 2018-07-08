/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import config from '../../config';
import User from '../user/user.model';
import APIError from '../helper/APIError';
import { checkPassword } from '../helper/utils';
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

const forgotPassword = async (req, res) => {
  const { username, password } = req.body;
  let status = httpStatus.OK;

  try {
    if (!checkPassword(password)) {
      throw new APIError('Invalid password', httpStatus.BAD_REQUEST);
    }
    const user = await User.findByUser(username);
    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(password, salt);
    const token = jwt.sign({
      id: user._id,
      password: newPassword,
    }, config.secret);

    user.password = newPassword;
    user.salt = salt;
    user.token = token;

    await user.save();
    return res.json({ token });
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
const productLogin = genLoginFunction(ProductUser);


export { login, productLogin, forgotPassword };