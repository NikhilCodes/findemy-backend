import { Cart } from "../entities/index.js";
import { Types } from "mongoose";

export const emptyCartItems = async (userId) => {
  const cartItems = await Cart.find({ user: userId });
  const resp = await Cart.deleteMany({ _id: { $in: cartItems.map(item => item._id) } });
}

export const getCartItems = async (userId) => {
  const carts = await Cart.aggregate([
    {
      $match: {
        user: new Types.ObjectId(userId),
      }
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $replaceRoot: {
        newRoot: "$course",
      },
    },
    {
      $lookup: {
        from: 'enrolls',
        localField: '_id',
        foreignField: 'course',
        as: 'enrollDocs',
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
      },
    },
    {
      $unwind: '$creator',
    },
    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'course',
        as: 'ratings',
      }
    },
    {
      $addFields: {
        enrolls: {
          $size: '$enrollDocs',
        },
        rating: {
          averageRating: {
            $avg: '$ratings.rating',
          },
          totalRatings: {
            $size: "$ratings",
          },
        },
      }
    }
  ]);
  return carts;
}

export const addCartItem = async (userId, courseId) => {
  const cart = Cart({ user: userId, course: courseId });
  const resp = await cart.save();
  return resp;
}

export const removeCartItem = async (userId, courseId) => {
  const resp = await Cart.deleteOne({ user: Types.ObjectId(userId), course: Types.ObjectId(courseId) });
  return resp;
}
