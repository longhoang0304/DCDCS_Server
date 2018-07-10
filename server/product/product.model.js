import mongoose, { Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helper/APIError';

const ProductSchema = new Schema(
  {
    model: {
      // 1 model can have many producs
      type: Schema.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sale: {
      type: Number,
      default: 0,
    },
    warrantyPeriod: {
      type: Number,
      default: 12, // months
    },
    broughtAt: {
      type: Schema.Types.Date,
    },
    name: {
      type: String,
      default: '',
    },
  },
  {
    collection: 'products',
  },
);

ProductSchema.method({
});

ProductSchema.statics = {
  async get(id) {
    const product = await this.findById(id).exec();
    if (product) {
      return product;
    }
    throw new APIError('No such product exist!', httpStatus.NOT_FOUND);
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      // .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

export default mongoose.model('Products', ProductSchema);