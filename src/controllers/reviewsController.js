import * as reviewsService from "../services/reviewsService.js";

export async function createReview(req, res) {
  try {
    const { bookId } = req.params;
    const { review, rating, userId } = req.body; // Incluye rating aquí
    await reviewsService.createReview(bookId, review, rating, userId);
    res.status(201).json({ success: true, message: "Reseña creada con éxito" });
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function getReviews(req, res) {
  try {
    const reviews = await reviewsService.getReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function getReviewsByBook(req, res) {
  try {
    const { bookId } = req.params;
    const reviews = await reviewsService.getReviewsByBook(bookId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function getReviewById(req, res) {
  const reviewId = req.params.id;

  try {
    const review = await reviewsService.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error getting review by ID in controller:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function reportReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { userId, comment } = req.body;
    await reviewsService.reportReview(reviewId, userId, comment);
    res
      .status(200)
      .json({ success: true, message: "Reseña reportada con éxito" });
  } catch (error) {
    console.error("Error reporting review:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function deleteReviewById(req, res) {
  try {
    const { id } = req.params;
    const result = await reviewsService.deleteReviewById(id);
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Reseña eliminada con éxito" });
    } else {
      res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function getReviewsByUser(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await reviewsService.getReviewsByUser(userId);

    if (!reviews.length) {
      return res
        .status(404)
        .json({ success: false, message: "No reviews found" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function removeReviewByUser(req, res) {
  try {
    const { id } = req.params;
    const result = await reviewsService.removeReviewByUser(id);
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Reseña eliminada con éxito" });
    } else {
      res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function updateReview(req, res) {
  try {
    const reviewId = req.params.id;
    const { rating, review } = req.body;

    // Validar que se pasaron los campos requeridos
    if (rating === undefined || review === undefined) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const updatedReview = await reviewsService.updateReview(reviewId, { rating, review });

    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error in updateReview controller:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export default {
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
