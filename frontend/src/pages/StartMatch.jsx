import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "../services/Api";

// =====================================================
// IMAGE BASE URL
// =====================================================

const IMAGE_BASE_URL = "http://localhost:5000";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  // Backend already complete URL bhej raha hai
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // /uploads/file.jpg
  if (imagePath.startsWith("/uploads/")) {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }

  // uploads/file.jpg
  if (imagePath.startsWith("uploads/")) {
    return `${IMAGE_BASE_URL}/${imagePath}`;
  }

  // Sirf filename.jpg
  return `${IMAGE_BASE_URL}/uploads/${imagePath}`;
};

// =====================================================
// API FUNCTIONS
// =====================================================

const getPlayers = async (id) => {
  const response = await API.get(`/matches/players/${id}`);

  return response.data;
};

const getScore = async (id) => {
  const response = await API.get(`/matches/score/${id}`);

  return response.data;
};

const addShot = async (data) => {
  const response = await API.post("/matches/addshots", data);

  return response.data;
};

const updateMatchStatus = async (id) => {
  const response = await API.put(`/matches/MatchStatusUpdate/${id}`, {
    Status: "Completed",
  });

  return response.data;
};

// =====================================================
// COMPONENT
// =====================================================

function StartMatch() {
  const { id } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // =====================================================
  // FORM STATES
  // =====================================================

  const [Team, setTeam] = useState("");
  const [Player_id, setPlayer_id] = useState("");
  const [Shot_type, setShot_type] = useState("");
  const [Is_goal, setIs_goal] = useState(false);

  // =====================================================
  // GET PLAYERS
  // =====================================================

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["players", id],
    queryFn: () => getPlayers(id),
  });

  // =====================================================
  // GET LIVE SCORE
  // =====================================================

  const { data: scoreData } = useQuery({
    queryKey: ["score", id],
    queryFn: () => getScore(id),

    // Har 2 second baad score refresh
    refetchInterval: 2000,
  });

  // =====================================================
  // ADD SHOT MUTATION
  // =====================================================

  const addShotMutation = useMutation({
    mutationFn: addShot,

    onSuccess: () => {
      alert("Shot Added Successfully");

      // Form reset
      setTeam("");
      setPlayer_id("");
      setShot_type("");
      setIs_goal(false);

      // Score refresh
      queryClient.invalidateQueries({
        queryKey: ["score", id],
      });
    },

    onError: (error) => {
      console.log("Add Shot Error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Shot Add Failed");
    },
  });

  // =====================================================
  // COMPLETE MATCH MUTATION
  // =====================================================

  const completeMatchMutation = useMutation({
    mutationFn: () => updateMatchStatus(id),

    onSuccess: async () => {
      alert("Match completed successfully");

      // Matches list refresh
      await queryClient.invalidateQueries({
        queryKey: ["matches"],
      });

      // Current match refresh
      await queryClient.invalidateQueries({
        queryKey: ["match", id],
      });

      // Match details refresh
      await queryClient.invalidateQueries({
        queryKey: ["matchDetails", id],
      });

      navigate("/dashboard");
    },

    onError: (error) => {
      console.log("Match Status Error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Match complete nahi ho saka");
    },
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <div style={styles.center}>
        <h2>Error loading players</h2>

        <p>{error?.message || "Something went wrong"}</p>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const match = data?.match;

  const players = data?.players || [];

  // =====================================================
  // TEAM IMAGES
  // =====================================================

  const teamAImage = getImageUrl(match?.Team_A_Pic);

  const teamBImage = getImageUrl(match?.Team_B_Pic);

  // =====================================================
  // FILTER PLAYERS
  // =====================================================

  const filteredPlayers = players.filter((player) => player.Team === Team);

  // =====================================================
  // SUBMIT SHOT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Team) {
      alert("Please select team");
      return;
    }

    if (!Player_id) {
      alert("Please select player");
      return;
    }

    if (!Shot_type) {
      alert("Please select shot type");
      return;
    }

    addShotMutation.mutate({
      Match_id: id,
      Player_id: Number(Player_id),
      Shot_type,
      Is_goal,
      Team,
    });
  };

  // =====================================================
  // COMPLETE MATCH
  // =====================================================

  const handleCompleteMatch = () => {
    if (window.confirm("Are you sure you want to complete this match?")) {
      completeMatchMutation.mutate();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.container}>
      {/* =================================================
          TITLE
      ================================================= */}

      <h2 style={styles.mainTitle}>Start Match</h2>

      {/* =================================================
          LIVE SCORE
      ================================================= */}

      {scoreData && (
        <div style={styles.scoreCard}>
          <h3 style={styles.liveTitle}>LIVE SCORE</h3>

          <div style={styles.scoreTeams}>
            {/* =================================================
                TEAM A SCORE
            ================================================= */}

            <div style={styles.scoreTeam}>
              {teamAImage ? (
                <img
                  src={teamAImage}
                  alt={match?.Team_A}
                  style={styles.scoreTeamImage}
                  onError={(event) => {
                    console.log("TEAM A SCORE IMAGE ERROR:", teamAImage, event);
                  }}
                />
              ) : (
                <div style={styles.scoreTeamPlaceholder}>
                  {match?.Team_A?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}

              <h2>{scoreData.match?.Team_A || match?.Team_A || "Team A"}</h2>

              <div style={styles.scoreNumber}>
                {scoreData.score?.teamA || 0}
              </div>
            </div>

            {/* =================================================
                VS
            ================================================= */}

            <div style={styles.vs}>VS</div>

            {/* =================================================
                TEAM B SCORE
            ================================================= */}

            <div style={styles.scoreTeam}>
              {teamBImage ? (
                <img
                  src={teamBImage}
                  alt={match?.Team_B}
                  style={styles.scoreTeamImage}
                  onError={(event) => {
                    console.log("TEAM B SCORE IMAGE ERROR:", teamBImage, event);
                  }}
                />
              ) : (
                <div style={styles.scoreTeamPlaceholder}>
                  {match?.Team_B?.charAt(0)?.toUpperCase() || "B"}
                </div>
              )}

              <h2>{scoreData.match?.Team_B || match?.Team_B || "Team B"}</h2>

              <div style={styles.scoreNumber}>
                {scoreData.score?.teamB || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SELECT TEAM / FORM
      ================================================= */}

      <form onSubmit={handleSubmit}>
        {/* =================================================
            SELECT TEAM
        ================================================= */}

        <div style={styles.formGroup}>
          <label style={styles.label}>Select Team</label>

          <br />

          <select
            value={Team}
            onChange={(e) => {
              setTeam(e.target.value);

              // Team change par player reset
              setPlayer_id("");
            }}
            style={styles.select}
          >
            <option value="">Select Team</option>

            <option value={match?.Team_A}>{match?.Team_A}</option>

            <option value={match?.Team_B}>{match?.Team_B}</option>
          </select>
        </div>

        {/* =================================================
            PLAYERS
        ================================================= */}

        <div style={styles.formGroup}>
          <label style={styles.label}>Select Player</label>

          <div style={styles.playerGrid}>
            {filteredPlayers.length === 0 ? (
              <p>{Team ? "No players found" : "First select a team"}</p>
            ) : (
              filteredPlayers.map((player) => {
                const playerImage = getImageUrl(player.Player_Pic);

                return (
                  <div
                    key={player.id}
                    onClick={() => setPlayer_id(String(player.id))}
                    style={{
                      ...styles.playerCard,

                      ...(Player_id === String(player.id)
                        ? styles.selectedPlayer
                        : {}),
                    }}
                  >
                    {/* PLAYER PICTURE */}

                    {playerImage ? (
                      <img
                        src={playerImage}
                        alt={player.Player_name}
                        style={styles.playerImage}
                        onError={(event) => {
                          console.log(
                            "PLAYER IMAGE ERROR:",
                            playerImage,
                            event,
                          );
                        }}
                      />
                    ) : (
                      <div style={styles.playerPlaceholder}>
                        {player.Player_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}

                    {/* PLAYER NAME */}

                    <span style={styles.playerName}>{player.Player_name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =================================================
            SHOT TYPE
        ================================================= */}

        <div style={styles.formGroup}>
          <label style={styles.label}>Shot Type</label>

          <br />

          <select
            value={Shot_type}
            onChange={(e) => setShot_type(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Shot Type</option>

            <option value="Goal">Goal</option>

            <option value="Penalty">Penalty</option>

            <option value="Free Kick">Free Kick</option>

            <option value="Header">Header</option>

            <option value="Long Shot">Long Shot</option>

            <option value="Own Goal">Own Goal</option>
          </select>
        </div>

        {/* =================================================
            GOAL
        ================================================= */}

        {Team && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Goal</label>

            <br />

            <select
              value={Is_goal ? "1" : "0"}
              onChange={(e) => setIs_goal(e.target.value === "1")}
              style={styles.select}
            >
              <option value="0">No</option>

              <option value="1">Yes</option>
            </select>
          </div>
        )}

        {/* =================================================
            ADD SHOT BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={addShotMutation.isPending}
          style={styles.addButton}
        >
          {addShotMutation.isPending ? "Adding..." : "Add Shot"}
        </button>
      </form>

      <hr style={styles.hr} />

      {/* =================================================
          GOAL TIMELINE
      ================================================= */}

      <h3>Goal Timeline</h3>

      {!scoreData || !scoreData.goals || scoreData.goals.length === 0 ? (
        <p>No Goals Yet</p>
      ) : (
        scoreData.goals.map((goal, index) => {
          const player = scoreData.players?.find(
            (p) => p.id === goal.Player_id,
          );

          const goalPlayerImage = getImageUrl(player?.Player_Pic);

          return (
            <div key={goal.id} style={styles.goalCard}>
              {/* PLAYER PICTURE */}

              {goalPlayerImage ? (
                <img
                  src={goalPlayerImage}
                  alt={player?.Player_name}
                  style={styles.goalPlayerImage}
                  onError={(event) => {
                    console.log(
                      "GOAL PLAYER IMAGE ERROR:",
                      goalPlayerImage,
                      event,
                    );
                  }}
                />
              ) : (
                <div style={styles.goalPlayerPlaceholder}>
                  {player?.Player_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}

              {/* GOAL INFORMATION */}

              <div style={styles.goalInfo}>
                <strong>
                  {index + 1}. {player?.Player_name || "Unknown Player"}
                </strong>

                <br />

                <span>Team: {player?.Team || goal.Team || "-"}</span>

                <br />

                <span>Shot: {goal.Shot_type || "-"}</span>

                <br />

                <span>
                  Time:{" "}
                  {goal.createdAt
                    ? new Date(goal.createdAt).toLocaleTimeString()
                    : "-"}
                </span>
              </div>
            </div>
          );
        })
      )}

      {/* =================================================
          COMPLETE MATCH
      ================================================= */}

      <button
        onClick={handleCompleteMatch}
        disabled={completeMatchMutation.isPending}
        style={styles.completeButton}
      >
        {completeMatchMutation.isPending
          ? "Completing..."
          : "Complete The Match"}
      </button>
    </div>
  );
}

export default StartMatch;

// =====================================================
// STYLES
// =====================================================

const styles = {
  // =====================================================
  // CONTAINER
  // =====================================================

  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
  },

  mainTitle: {
    textAlign: "center",
    marginBottom: "25px",
  },

  center: {
    textAlign: "center",
    padding: "30px",
  },

  // =====================================================
  // LIVE SCORE
  // =====================================================

  scoreCard: {
    border: "2px solid black",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
    textAlign: "center",
  },

  liveTitle: {
    marginBottom: "20px",
  },

  scoreTeams: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "50px",
  },

  scoreTeam: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "160px",
  },

  scoreTeamImage: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
    marginBottom: "8px",
  },

  scoreTeamPlaceholder: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    fontWeight: "bold",
    marginBottom: "8px",
  },

  scoreNumber: {
    fontSize: "50px",
    fontWeight: "bold",
  },

  vs: {
    fontSize: "24px",
    fontWeight: "bold",
  },

  // =====================================================
  // FORM
  // =====================================================

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    fontWeight: "bold",
    fontSize: "16px",
  },

  select: {
    padding: "10px",
    minWidth: "250px",
    marginTop: "7px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  // =====================================================
  // PLAYER GRID
  // =====================================================

  playerGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "12px",
  },

  playerCard: {
    width: "110px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: "#fff",
  },

  selectedPlayer: {
    border: "3px solid #007bff",
  },

  playerImage: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    margin: "auto",
  },

  playerPlaceholder: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    fontSize: "24px",
    fontWeight: "bold",
  },

  playerName: {
    display: "block",
    marginTop: "8px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  // =====================================================
  // ADD BUTTON
  // =====================================================

  addButton: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },

  // =====================================================
  // HR
  // =====================================================

  hr: {
    marginTop: "30px",
    marginBottom: "25px",
  },

  // =====================================================
  // GOAL TIMELINE
  // =====================================================

  goalCard: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
  },

  goalPlayerImage: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "12px",
  },

  goalPlayerPlaceholder: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    fontSize: "20px",
    fontWeight: "bold",
  },

  goalInfo: {
    lineHeight: "1.6",
  },

  // =====================================================
  // COMPLETE BUTTON
  // =====================================================

  completeButton: {
    marginTop: "25px",
    padding: "14px 25px",
    backgroundColor: "#198754",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
