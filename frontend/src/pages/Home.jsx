import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/Api";

// =====================================================
// IMAGE BASE URL
// =====================================================

const IMAGE_BASE_URL = "http://localhost:5000";

// =====================================================
// GET MATCHES
// =====================================================

const getMatches = async (status, page, limit) => {
  const response = await API.get("/matches/matcheslist", {
    params: {
      status: status,
      page: page,
      limit: limit,
    },
  });

  return response.data;
};

// =====================================================
// HOME
// =====================================================

function Home() {
  const queryClient = useQueryClient();

  // Current page
  const [page, setPage] = useState(1);

  // Ek page par kitne matches
  const limit = 5;

  // =====================================================
  // GET MATCHES
  // =====================================================

  const { data, isLoading, error } = useQuery({
    queryKey: ["matches", "Pending", page],
    queryFn: () => getMatches("Pending", page, limit),
  });

  const matches = data?.matches || [];
  const totalPages = data?.totalPages || 1;

  // =====================================================
  // DELETE MATCH
  // =====================================================

  const handleDelete = async (id) => {
    try {
      await API.delete(`/matches/MatchDelete/${id}`);

      alert("Match deleted successfully");

      await queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Match delete nahi ho saka");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return <div>Error loading matches</div>;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.container}>
      <h2>Matches List</h2>

      {/* =====================================================
          MATCHES
      ===================================================== */}

      {matches.map((match) => (
        <div key={match.id} style={styles.matchCard}>
          {/* =================================================
              TEAMS
          ================================================= */}

          <div style={styles.teamsContainer}>
            {/* ================= TEAM A ================= */}

            <div style={styles.team}>
              {match.Team_A_Pic ? (
                <img
                  src={`${IMAGE_BASE_URL}${match.Team_A_Pic}`}
                  alt={match.Team_A}
                  style={styles.teamImage}
                />
              ) : (
                <div style={styles.teamPlaceholder}>
                  {match.Team_A?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}

              <p style={styles.teamName}>{match.Team_A}</p>
            </div>

            {/* VS */}

            <div style={styles.vs}>VS</div>

            {/* ================= TEAM B ================= */}

            <div style={styles.team}>
              {match.Team_B_Pic ? (
                <img
                  src={`${IMAGE_BASE_URL}${match.Team_B_Pic}`}
                  alt={match.Team_B}
                  style={styles.teamImage}
                />
              ) : (
                <div style={styles.teamPlaceholder}>
                  {match.Team_B?.charAt(0)?.toUpperCase() || "B"}
                </div>
              )}

              <p style={styles.teamName}>{match.Team_B}</p>
            </div>
          </div>

          {/* =================================================
              MATCH INFORMATION
          ================================================= */}

          <p>
            <strong>Venue:</strong> {match.Venue}
          </p>

          <p>
            <strong>Start Time:</strong>{" "}
            {match.Start_Time
              ? new Date(match.Start_Time).toLocaleString()
              : "N/A"}
          </p>

          <p>
            <strong>Status:</strong> {match.Status}
          </p>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div style={styles.actions}>
            <Link to={`/matchupdate/${match.id}`} style={styles.updateButton}>
              Update
            </Link>

            <button
              onClick={() => handleDelete(match.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>

            <Link
              to={`/addplayers/${match.id}`}
              style={styles.addPlayersButton}
            >
              Add Players
            </Link>

            <Link to={`/startmatch/${match.id}`} style={styles.startButton}>
              Start Match
            </Link>
          </div>
        </div>
      ))}

      {/* =====================================================
          NO MATCHES
      ===================================================== */}

      {matches.length === 0 && <p>No Pending Matches Found</p>}

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;

// =====================================================
// STYLES
// =====================================================

const styles = {
  container: {
    padding: "20px",
  },

  matchCard: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  },

  // =====================================================
  // TEAMS
  // =====================================================

  teamsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    marginBottom: "20px",
  },

  team: {
    textAlign: "center",
    minWidth: "150px",
  },

  teamImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #ccc",
  },

  teamPlaceholder: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    fontSize: "30px",
    fontWeight: "bold",
  },

  teamName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "8px",
  },

  vs: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  // =====================================================
  // ACTIONS
  // =====================================================

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "15px",
  },

  updateButton: {
    padding: "8px 12px",
    backgroundColor: "#ffc107",
    color: "black",
    textDecoration: "none",
    borderRadius: "5px",
  },

  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  addPlayersButton: {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },

  startButton: {
    padding: "8px 12px",
    backgroundColor: "#198754",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },

  // =====================================================
  // PAGINATION
  // =====================================================

  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
  },
};
