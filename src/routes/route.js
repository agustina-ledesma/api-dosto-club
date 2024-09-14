import express from "express";
import multer from "multer";
import * as bookController from "../controllers/bookController.js";
import * as usersController from "../controllers/usersController.js";
import * as reviewsController from "../controllers/reviewsController.js";
import * as epubController from "../controllers/EpubController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";

import { checkAdmin } from "../middleware/AdminMiddleware.js";
import upload from "../middleware/upload.js";
import uploadEpub from "../middleware/uploadEpub.js";

const router = express.Router();

router.get("/books", bookController.getAllBooks);
router.get("/book/:id", bookController.getBookById);

router.post(
  "/books",
  authenticateToken,
  checkAdmin,
  upload.single("image"),

  
  bookController.createBook 
);


router.get("/epubs" ,           epubController.getAllEpubs);
router.get("/epub/:id" ,         epubController.getEpubById);
router.post("/epub/:bookId" , uploadEpub.single("epub") ,epubController.uploadEpub);

router.get('/epub-book/:bookId', epubController.getEpubByBookId);

router.delete('/epub/:id' , uploadEpub.single("epub")  , epubController.deleteEpub);


router.put(
  "/book/:id",
  authenticateToken,
  checkAdmin,
  upload.single("image"),
  bookController.editBook
);
router.delete(
  "/book/:id",
  authenticateToken,
  checkAdmin,
  upload.single("image"),
  bookController.deleteBook
);

/* Reseñas */

router.get("/reviews", reviewsController.getReviews);
router.get("/reviews/:id", reviewsController.getReviewById);
router.post(
  "/reviews/:bookId",
  authenticateToken,
  reviewsController.createReview
);
router.get("/reviews/book/:bookId", reviewsController.getReviewsByBook);
router.patch(
  "/reviews/report/:reviewId",
  authenticateToken,
  reviewsController.reportReview
);

router.delete(
  "/reviews/:id",
  authenticateToken, checkAdmin,
  reviewsController.deleteReviewById
);

router.get('/reviews/user/:userId',   authenticateToken ,  reviewsController.getReviewsByUser);

router.delete('/reviews/user/:id',   authenticateToken, reviewsController.removeReviewByUser);

router.put('/reviews/:id', authenticateToken, reviewsController.updateReview);


/* Usuario */

router.post("/create-user",   usersController.createUser);
router.post("/login",         usersController.login);
router.get("/users",          usersController.getAllUsers);
router.get("/user/:id",       usersController.getUserById);

router.post(
  "/user/:userId/book/:bookId",
  authenticateToken,
  usersController.markBookStatus
);

router.get(
  "/user/:userId/books",
  authenticateToken,
  usersController.getMarkedBooks
);

router.delete(
  "/user/:userId/book/:bookId",
  authenticateToken,
  usersController.removeBook
);

router.get(
  "/user/:userId/book/:bookId",
  authenticateToken,
  usersController.getMarkedBookById
);

router.post("/update-profile/:userId" ,   upload.single("image"), authenticateToken, usersController.updateProfile);

router.put("/update-profile-image/:userId" , upload.single("image") , authenticateToken, usersController.removeImage);



/* Highlight */

router.post('/highlights' ,                 usersController.addHighlight);
router.get('/highlights/:userId/:bookId',   usersController.getHighlights);
router.get('/highlights-user/:userId' ,     usersController.getHighlightsByUser);

//FAVORITES///
router.get('/favorites' ,           usersController.getAllFavorites);
router.get('/favorites/:id' ,        usersController.getFavoriteById);
router.post('/favorites/:bookId',    authenticateToken, usersController.addFavorite);
router.delete('/favorites/:id',       authenticateToken, usersController.removeFavorite);

router.get('/favorites-user/:userId' , authenticateToken, usersController.getFavoriteByUser );



export default router;
