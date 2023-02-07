import { Cart, Course, Enroll } from '../entities';
import { Types } from 'mongoose';

export async function findCoursesByTitleSubstringAndLevels(substr, levels, userId, size=10, page = 0) {
  const skip = page * size;
  const query = [
    {
      $search: {
        index: 'fulltxt_search',
        text: {
          query: `${substr}`,
          path: {
            wildcard: '*'
          }
        }
      }
    },
    {
      $match: {}
    },
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
      }
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
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        creator: {
          name: 1,
          email: 1,
        },
        price: 1,
        isBestSeller: 1,
        rating: {
          averageRating: {
            $avg: '$ratings.rating',
          },
          totalRating: {
            $size: "$ratings",
          },
        },
        userIsEnrolled: {
          $in: [new Types.ObjectId(userId), '$enrollDocs.user'],
        },
      },
    },
    {
      $sort: {
        isBestSeller: -1,
      }
    },
    {
      $limit: skip + size,
    },
    {
      $skip: skip,
    }
  ];
  if (levels.length > 0) {
    query[1] = {
      $match: {
        level: {
          $in: levels,
        }
      }
    };
  } else {
    query.splice(1, 1);
  }
  const data = await Course.aggregate(query);

  const dataWithCart = await Promise.all(
    data.map(async (course) => {
      const cart = await Cart.findOne({
        user: Types.ObjectId(userId),
        course: course._id,
      });
      return {
        ...course,
        isAddedToCart: !!cart,
      }
    })
  );

  return {
    data: dataWithCart,
    total: await Course.aggregate([
      {
        $search: {
          index: 'fulltxt_search',
          text: {
            query: `${substr}`,
            path: {
              wildcard: '*'
            }
          }
        }
      },
      {
        $match: { level: { $in: levels } }
      }
    ]).then((data) => data.length),
  }
}

export async function findCoursesById(id, userId) {
  const data = await Course.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator',
      }
    },
    {
      $unwind: '$creator',
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
        from: 'ratings',
        localField: '_id',
        foreignField: 'course',
        as: 'ratings',
      },
    },
    {
      $lookup: {
        from: 'carts',
        localField: '_id',
        foreignField: 'course',
        as: 'cart',
      }
    },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        learnings: 1,
        requirements: 1,
        creator: {
          name: 1,
          email: 1,
          occupation: 1,
          reviews: 1,
          rating: 1,
          courses: 1,
          avatar: 1,
          students: 1,
          description: 1,
        },
        enrolls: {
          $size: '$enrollDocs',
        },
        price: 1,
        isBestSeller: 1,
        rating: {
          averageRating: {
            $avg: '$ratings.rating',
          },
          totalRatings: {
            $size: "$ratings",
          },
        },
        trailerVideo: 1,
        subTitle: 1,
        userIsEnrolled: {
          $in: [new Types.ObjectId(userId), '$enrollDocs.user'],
        }
      }
    },
  ]).then((value) => value[0]);
  const cart = await Cart.findOne({
    user: Types.ObjectId(userId),
    course: data._id,
  });

  return {
    ...data,
    isAddedToCart: !!cart,
  }
}

export function findCoursesByStudentViewing() {
  return Course.aggregate([
    {
      $lookup: {
        from: 'enrolls',
        localField: '_id',
        foreignField: 'course',
        as: 'enrolls',
      },
    },
    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'course',
        as: 'ratings',
      },
    },
    {
      $addFields: {
        enrolls: {
          $size: '$enrolls',
        },
        rating: {
          averageRating: {
            $avg: '$ratings.rating',
          },
          totalRating: {
            $size: "$ratings",
          },
        },
      },
    },
    {
      $sort: {
        enrolls: -1,
      },
    },
  ]);
}

export function findCoursesByLevel(level) {
  return Course.find({
    level,
  })
}

export function findCoursesByCreatorId(creatorId) {
  return Course.find({
    creator: creatorId,
  })
}

export function enrollCourse(courseId, userId) {
  const enroll = new Enroll({
    course: courseId,
    user: userId,
  });
  return enroll.save();
}