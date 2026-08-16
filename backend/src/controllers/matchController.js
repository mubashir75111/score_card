import { Public } from "@prisma/client/runtime/client";
import prisma from "../config/db.js";

export const addMatch = async (req, res) => {
  try {
    const { Team_A, Team_B, Venue, Start_Time } = req.body;

    // Uploaded images
    const Team_A_Pic = req.files?.Team_A_Pic?.[0]
      ? `/uploads/${req.files.Team_A_Pic[0].filename}`
      : null;

    const Team_B_Pic = req.files?.Team_B_Pic?.[0]
      ? `/uploads/${req.files.Team_B_Pic[0].filename}`
      : null;

    const match = await prisma.match.create({
      data: {
        Team_A,
        Team_A_Pic,

        Team_B,
        Team_B_Pic,

        Venue,
        Start_Time: new Date(Start_Time),
        Status: "Pending",

        // Logged-in user ke saath relation
        user: {
          connect: {
            id: req.user.userId,
          },
        },
      },
    });

    res.status(201).json({
      message: "Match created successfully",
      match,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create match",
      error: error.message,
    });
  }
};

export const MatchesList = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const { status } = req.query;

    // Logged-in user ki ID
    const userId = req.user.userId;

    // Total matches
    const totalMatches = await prisma.match.count({
      where: {
        Status: status,
        userId: userId,
      },
    });

    // Current page matches
    const matches = await prisma.match.findMany({
      where: {
        Status: status,
        userId: userId,
      },
      skip: skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });

    const totalPages = Math.ceil(totalMatches / limit);

    res.status(200).json({
      matches,
      totalMatches,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch matches",
      error: error.message,
    });
  }
};
export const getSingleMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    res.json(match);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const MatchUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { Team_A, Team_B, Venue, Start_Time } = req.body;

    // Existing images ko change na karne ki surat mein
    const data = {
      Team_A,
      Team_B,
      Venue,
      Start_Time: new Date(Start_Time),
    };

    // Agar Team A ki new image upload hui hai
    if (req.files?.Team_A_Pic?.[0]) {
      data.Team_A_Pic = `/uploads/${req.files.Team_A_Pic[0].filename}`;
    }

    // Agar Team B ki new image upload hui hai
    if (req.files?.Team_B_Pic?.[0]) {
      data.Team_B_Pic = `/uploads/${req.files.Team_B_Pic[0].filename}`;
    }

    const match = await prisma.match.update({
      where: {
        id: Number(id),
      },

      data,
    });

    res.status(200).json({
      message: "Match updated successfully",
      match,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update match",
      error: error.message,
    });
  }
};
export const MatchDelete = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.match.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Match deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete match",
      error: error.message,
    });
  }
};
export const AddPlayer = async (req, res) => {
  try {
    const { id, Team, Player_name } = req.body;

    // Uploaded player image
    const Player_Pic = req.file ? `/uploads/${req.file.filename}` : null;

    const player = await prisma.players.create({
      data: {
        Match_id: Number(id),
        Team,
        Player_name,
        Player_Pic,
      },
    });

    res.status(201).json({
      message: "Player added successfully",
      player,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add player",
      error: error.message,
    });
  }
};
export const getSingleMatchPlayers = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: {
        id: Number(id),
      },
    });

    const players = await prisma.players.findMany({
      where: {
        Match_id: Number(id),
      },
    });

    res.status(200).json({
      match,
      players,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const addShots = async (req, res) => {
  try {
    const { Match_id, Player_id, Shot_type, Is_goal, Team } = req.body;

    const shot = await prisma.goals.create({
      data: {
        Match_id: Number(Match_id),
        Player_id: Number(Player_id),
        Shot_type,
        Is_goal,
        Team,
      },
    });

    res.status(201).json({
      message: "Shot Added Successfully",
      shot,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const getMatchScore = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    const players = await prisma.players.findMany({
      where: {
        Match_id: Number(id),
      },
    });

    const goals = await prisma.goals.findMany({
      where: {
        Match_id: Number(id),
        Is_goal: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let teamAScore = 0;
    let teamBScore = 0;

    for (const goal of goals) {
      const player = players.find((p) => p.id === goal.Player_id);

      if (!player) continue;

      if (player.Team === match.Team_A) {
        teamAScore++;
      } else if (player.Team === match.Team_B) {
        teamBScore++;
      }
    }

    return res.json({
      match,
      players,
      goals,
      score: {
        teamA: teamAScore,
        teamB: teamBScore,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getMatchDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        players: true,

        goals: {
          where: {
            Is_goal: true,
          },

          include: {
            player: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    // =========================
    // TEAM A PLAYERS
    // =========================

    const teamAPlayers = match.players.filter(
      (player) => player.Team === match.Team_A,
    );

    // =========================
    // TEAM B PLAYERS
    // =========================

    const teamBPlayers = match.players.filter(
      (player) => player.Team === match.Team_B,
    );

    // =========================
    // TEAM A GOALS
    // =========================

    const teamAGoals = match.goals.filter(
      (goal) => goal.Team === match.Team_A,
    ).length;

    // =========================
    // TEAM B GOALS
    // =========================

    const teamBGoals = match.goals.filter(
      (goal) => goal.Team === match.Team_B,
    ).length;

    // =========================
    // GOAL SCORERS
    // =========================

    const scorers = match.goals.map((goal) => ({
      id: goal.id,

      Team: goal.Team,

      Player_Name: goal.player.Player_name,

      Player_Pic: goal.player.Player_Pic,

      Shot_Type: goal.Shot_type,

      createdAt: goal.createdAt,
    }));

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      Match: {
        id: match.id,
        Team_A: match.Team_A,
        Team_B: match.Team_B,
        Team_A_Pic: match.Team_A_Pic,
        Team_B_Pic: match.Team_B_Pic,
        Venue: match.Venue,
        Start_Time: match.Start_Time,
        Status: match.Status,
      },

      Team_A_Players: teamAPlayers,

      Team_B_Players: teamBPlayers,

      Team_A_Goals: teamAGoals,

      Team_B_Goals: teamBGoals,

      GoalScorers: scorers,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
export const MatchStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.update({
      where: {
        id: Number(id),
      },
      data: {
        Status: "Completed",
      },
    });

    res.status(200).json({
      message: "Match updated successfully",
      match,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update match",
      error: error.message,
    });
  }
};
