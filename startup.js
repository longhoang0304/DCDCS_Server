/* eslint-disable no-underscore-dangle */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import log from './libs/logger';
import User from './server/user/user.model';
import config from './config';

/**
 * This function will generate admin account
 */
async function genAdmin() {
  const username = 'crabbycrab';
  if (User.findByUser(username)) {
    log.warning('Admin account already exists!');
    return false;
  }
  const pass = 'anhcothuongemkhong';
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(pass, salt);
  const user = new User({
    username,
    password,
    salt,
    createdAt: new Date(),
    products: null,
    isAdmin: true,
  });

  const token = jwt.sign({
    id: user._id,
  }, config.secret);

  user.token = token;
  try {
    await user.save();
  } catch (error) {
    log.error('ERROR WHILE CREATING ADMINISTRATOR ACCOUNT');
    log.error(`MESSAGE: ${error.message}`);
    return false;
  }
  return true;
}

/**
 *
 * @param {Number | String} port
 * This function will start when server is ready
 */
async function startup(port) {
  log.log();
  log.info('Creating admin account');
  if (await genAdmin()) {
    log.success('Admin account has been created successfully!');
  } else {
    log.error('Admin account has not been created!');
  }
  log.log();
  log.success(`Listenning requests on port ${port}`);
  log.log();
}

export default startup;