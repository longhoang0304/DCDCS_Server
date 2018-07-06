/* eslint-disable no-underscore-dangle */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import ProductUser from './product.user.model';
import config from '../../config';
import { checkPassword } from '../helper/utils';
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @param {String | ObjectID} id
 * Load single user
 */
async function load(req, res, next, id) {
  try {
    const user = await ProductUser.get(id);
    req.user = user;
    return next();
  } catch (error) {
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * Get user information
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * update a user information
 */
async function update(req, res) {
  const { user } = req;
  const { newUser } = req.body;
  const newUsername = newUser.username;
  const checkUsername = (_.isString(newUsername) && user.username !== newUsername);
  const samePassword = bcrypt.compareSync(newUser.password, user.password);

  // when password is changed, recalculated hash
  if (!samePassword) {
    const salt = bcrypt.genSaltSync(10);
    newUser.salt = salt;
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    const token = jwt.sign({
      id: user._id,
      password: newUser.password,
    }, config.secret);
    newUser.token = token;
  }
  if (samePassword) {
    newUser.password = user.password;
  }

  _.assign(user, newUser);

  try {
    if (checkUsername) {
      await ProductUser.checkExist(user);
    }
    await user.save();
    return res.json({ token: user.token });
  } catch (error) {
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * create a user
 */
async function create(req, res) {
  const pass = req.body.password;
  if (!checkPassword(pass)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Invalid password',
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(pass, salt);
  const user = new ProductUser({
    ...req.body,
    password,
    salt,
  });

  const token = jwt.sign({
    id: user._id,
    password,
  }, config.secret);

  user.token = token;
  user.createdAt = new Date();

  try {
    await ProductUser.checkExist(user);
    const newUser = await user.save();
    return res.json(newUser);
  } catch (error) {
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * load all users
 */
async function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const userList = await ProductUser.list({ skip, limit });
    return res.json(userList);
  } catch (error) {
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error.message,
    });
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * remove a user
 */
async function remove(req, res) {
  const { user } = req;
  try {
    const deletedUser = await user.remove();
    return res.json(deletedUser);
  } catch (error) {
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error.message,
    });
  }
}

export { load, get, list, update, create, remove };