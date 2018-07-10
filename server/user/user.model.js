import mongoose, { Schema } from 'mongoose';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import APIError from '../helper/APIError';
import config from '../../config';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      maxlength: 64,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
      maxlength: 128,
    },
    salt: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: new Date(),
      required: true,
    },
    token: {
      type: String,
      required: true,
      maxlength: 8192,
    },
    // one user can have many products
    products: {
      type: [{
        productId: Schema.Types.ObjectId,
        productName: String,
        broughtAt: Schema.Types.Date,
      }],
      default: [],
    },
    fullName: {
      type: String,
      required: true,
      default: '',
      maxlength: 255,
    },
    address: {
      type: String,
      required: true,
      default: '',
      maxlength: 1024,
    },
    phone: {
      type: String,
      default: '',
      maxlength: 32,
    },
    email: {
      type: String,
      default: '',
      maxlength: 255,
    },
    ssn: {
      type: String,
      default: '',
      maxlength: 255,
    },
  },
  {
    collection: 'users',
  },
);

UserSchema.method({
});

UserSchema.statics = {
  /**
   *
   * @param {String} id
   * Get user by Id
   */
  async get(id) {
    const user = await this.findById(id).exec();
    if (user) {
      return user;
    }
    throw new APIError('No such user exist!', httpStatus.NOT_FOUND);
  },
  /**
   *
   * @param {String} username
   * Get user by username
   */
  async findByUser(username) {
    const user = await this.findOne({ username }).exec();
    if (user) {
      return user;
    }
    throw new APIError('No such user exist!', httpStatus.NOT_FOUND);
  },
  /**
   *
   * @param {user} reqUser
   * Check user exsistance
   */
  async checkExist(reqUser) {
    const { username } = reqUser;
    const user = await this.findOne({ username }).exec();
    if (!user) return false;
    throw new APIError('Username is taken', httpStatus.BAD_REQUEST);
  },
  /**
   * @param {Object} decodedTokens
   * Verify user
   */
  async verifyToken(tokens) {
    const decodedTokens = jwt.verify(tokens, config.secret);
    const { password, id } = decodedTokens;
    const user = (await this.get(id)).toObject();
    if (!_.isEqual(user.password, password)) {
      throw new APIError('Your token is expired', httpStatus.BAD_REQUEST);
    }
    const isAdmin = !!user.isAdmin;
    return {
      isAdmin,
      id,
    };
  },
  /**
   * List all
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      // .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
  /**
   *
   * @param {String} devideId
   * Update user device upon login
   */
  async updateDevices(username, devideId) {
    const user = await this.findByUser(username);
    if (!user) {
      throw new APIError('No such user exist!', httpStatus.NOT_FOUND);
    }
    if (user.deviceList.includes(devideId)) {
      user.deviceList.push(devideId);
      user.save();
      return true;
    }
    return false;
  },
};

export default mongoose.model('Users', UserSchema);