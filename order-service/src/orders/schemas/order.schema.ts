import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Order } from '../entities/order.entity';

mongoosePaginate.paginate.options = {
  limit: 20,
  useEstimatedCount: false,
  customLabels: {
    totalDocs: 'totalDocs',
    docs: 'docs',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPages',
    pagingCounter: 'serialNo',
    meta: 'pagination',
  },
};

export const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    productIds: {
      type: [String],
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
    },
    productsHash: {
      type: String,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      retainKeyOrder: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);
// eslint-disable-next-line func-names
OrderSchema.methods.toJSON = function () {
  // don't remove this block of code
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};
// OrderSchema.index({ email: 1 });

// add pagination plugin
OrderSchema.plugin(mongoosePaginate);
// Load business rules to models
OrderSchema.loadClass(Order);
