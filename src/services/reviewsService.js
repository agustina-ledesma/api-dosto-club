import { MongoClient, ObjectId } from "mongodb";
import { connectToDatabase } from "../db/db.js";
const db = await connectToDatabase();

const reviewsCollection = db.collection("reviews");

async function createReview(bookId, review, rating = null, userId) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    const newReview = {
      bookId: new ObjectId(bookId),
      review,
      rating: rating !== undefined ? rating : null,
      userId: new ObjectId(userId),
      reported: false,
      createdAt: new Date(),
    };
    await reviewsCollection.insertOne(newReview);
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

const getReviews = async () => {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection.find({}).toArray();
    return reviews;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

const getReviewsByBook = async (bookId) => {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");
    const reviews = await reviewsCollection
      .find({
        bookId: new ObjectId(bookId),
      })
      .toArray();
    return reviews;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

async function getReviewById(reviewId) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    // Buscar la reseña por ID
    const review = await reviewsCollection.findOne({
      _id: new ObjectId(reviewId),
    });

    if (!review) {
      throw new Error("Reseña no encontrada");
    }

    return review;
  } catch (error) {
    console.error("Error getting review by ID in service:", error);
    throw new Error("Error al obtener la reseña");
  }
}

async function reportReview(reviewId, userId, comment) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    await reviewsCollection.updateOne(
      { _id: new ObjectId(reviewId) },
      {
        $set: { reported: true },
        $push: {
          reports: {
            userId: new ObjectId(userId),
            comment: comment,
            date: new Date(),
          },
        },
      }
    );
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function deleteReviewById(id) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function getReviewsByUser(userId) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews by user:", error);
    throw error;
  }
}

async function removeReviewByUser(id) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function updateReview(reviewId, updateData) {
  try {
    const db = await connectToDatabase();
    const reviewsCollection = db.collection("reviews");

    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(reviewId) },
      { $set: updateData }
    );

    return result;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

export {
  createReview,
  getReviewsByBook,
  getReviews,
  reportReview,
  getReviewById,
  deleteReviewById,
  getReviewsByUser,
  removeReviewByUser,
  updateReview,
};
