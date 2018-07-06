import mongoose, { Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helper/APIError';

const ModelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    warrantyPeriod: {
      type: Number,
      required: true,
      default: 12,
    }, // monthes
    sale: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Schema.Types.Date,
      default: null,
    },
    supportEndDate: {
      type: Schema.Types.Date,
      default: null,
    },
  },
  {
    collection: 'models',
  },
);

ModelSchema.method({
});

ModelSchema.statics = {
  async get(id) {
    const Model = await this.findById(id).exec();
    if (Model) {
      return Model;
    }
    throw new APIError('No such model exist!', httpStatus.NOT_FOUND);
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      // .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

export default mongoose.model('Models', ModelSchema);