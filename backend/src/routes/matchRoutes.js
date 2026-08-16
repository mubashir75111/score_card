import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  addMatch,
  MatchesList,
  getSingleMatch,
  MatchUpdate,
  MatchDelete,
  AddPlayer,
  getSingleMatchPlayers,
  addShots,
  getMatchScore,
  getMatchDetails,
  MatchStatusUpdate,
} from "../controllers/matchController.js";

const router = express.Router();

// =========================
// MATCH
// =========================

// Add Match + Team A Pic + Team B Pic
router.post(
  "/match",
  authMiddleware,
  upload.fields([
    { name: "Team_A_Pic", maxCount: 1 },
    { name: "Team_B_Pic", maxCount: 1 },
  ]),
  addMatch,
);

// =========================
// MATCH OTHER ROUTES
// =========================

router.post("/addshots", addShots);

router.get("/matcheslist", authMiddleware, MatchesList);

router.get("/:id", getSingleMatch);

router.get("/players/:id", getSingleMatchPlayers);

router.put(
  "/matchupdate/:id",
  authMiddleware,
  upload.fields([
    { name: "Team_A_Pic", maxCount: 1 },
    { name: "Team_B_Pic", maxCount: 1 },
  ]),
  MatchUpdate,
);

router.delete("/matchdelete/:id", MatchDelete);

router.put("/MatchStatusUpdate/:id", MatchStatusUpdate);

// =========================
// PLAYER
// =========================

// Add Player + Player Pic
router.post("/addplayer", upload.single("Player_Pic"), AddPlayer);

router.get("/score/:id", getMatchScore);

router.get("/matchDetails/:id", getMatchDetails);

export default router;
