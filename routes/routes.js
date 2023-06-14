import express from "express";
import { addGame, games, home, removeGame } from "../controllers/game.js";
import {
  addressForm,
  failure,
  handlePayment,
  paymentForm,
  saveAddress,
  success,
} from "../controllers/checkout.js";
import { searchPage, transactionSearch } from "../controllers/search.js";

const router = express.Router();

// Games

router.get("/", home);

router.get("/games", games);

router.post("/add-game", addGame);

router.post("/remove-game", removeGame);

// Checkout

router.get("/start-checkout", addressForm);

router.post("/save-address", saveAddress);

router.get("/payment-details", paymentForm);

router.post("/submit-payment", handlePayment);

router.get("/success/:id", success);

router.get("/failure", failure);

// Search

router.get("/admin-search", searchPage);

router.get("/transaction-search", transactionSearch);

export default router;
