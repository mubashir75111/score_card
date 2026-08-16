import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  // Backend already complete URL bhej raha ho
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // /uploads/filename.jpg
  if (imagePath.startsWith("/uploads/")) {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }

  // uploads/filename.jpg
  if (imagePath.startsWith("uploads/")) {
    return `${IMAGE_BASE_URL}/${imagePath}`;
  }

  // Sirf filename.jpg
  return `${IMAGE_BASE_URL}/uploads/${imagePath}`;
};

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
// DASHBOARD
// =====================================================

function Dashboard() {
  // Current page
  const [page, setPage] = useState(1);

  // Har page par 5 matches
  const limit = 5;

  // =====================================================
  // GET COMPLETED MATCHES
  // =====================================================

  const { data, isLoading, error } = useQuery({
    queryKey: ["matches", "Completed", page],
    queryFn: () => getMatches("Completed", page, limit),
  });

  const matches = data?.matches || [];
  const totalPages = data?.totalPages || 1;

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
      <h2>Completed Matches</h2>

      {/* =====================================================
          MATCHES
      ===================================================== */}

      {matches.map((match) => {
        // Team A image
        const teamAImage = getImageUrl(match.Team_A_Pic);

        // Team B image
        const teamBImage = getImageUrl(match.Team_B_Pic);

        return (
          <div key={match.id} style={styles.matchCard}>
            {/* =================================================
                TEAMS
            ================================================= */}

            <div style={styles.teamsContainer}>
              {/* ================= TEAM A ================= */}

              <div style={styles.team}>
                {teamAImage ? (
                  <img
                    src={teamAImage}
                    alt={match.Team_A}
                    style={styles.teamImage}
                    onError={(e) => {
                      console.log("TEAM A IMAGE ERROR:", teamAImage);

                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={styles.teamPlaceholder}>
                    {match.Team_A?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}

                <p style={styles.teamName}>{match.Team_A || "Team A"}</p>
              </div>

              {/* ================= VS ================= */}

              <div style={styles.vs}>VS</div>

              {/* ================= TEAM B ================= */}

              <div style={styles.team}>
                {teamBImage ? (
                  <img
                    src={teamBImage}
                    alt={match.Team_B}
                    style={styles.teamImage}
                    onError={(e) => {
                      console.log("TEAM B IMAGE ERROR:", teamBImage);

                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={styles.teamPlaceholder}>
                    {match.Team_B?.charAt(0)?.toUpperCase() || "B"}
                  </div>
                )}

                <p style={styles.teamName}>{match.Team_B || "Team B"}</p>
              </div>
            </div>

            {/* =================================================
                MATCH INFORMATION
            ================================================= */}

            <div style={styles.matchInfo}>
              <p>
                <strong>Venue:</strong> {match.Venue || "N/A"}
              </p>

              <p>
                <strong>Start Time:</strong>{" "}
                {match.Start_Time
                  ? new Date(match.Start_Time).toLocaleString()
                  : "N/A"}
              </p>

              <p>
                <strong>Status:</strong> {match.Status || "Completed"}
              </p>
            </div>

            {/* =================================================
                MATCH DETAILS BUTTON
            ================================================= */}

            <Link to={`/matchDetails/${match.id}`} style={styles.detailsButton}>
              Match Details
            </Link>
          </div>
        );
      })}

      {/* =====================================================
          NO MATCHES
      ===================================================== */}

      {matches.length === 0 && <p>No Completed Matches Found</p>}

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
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

export default Dashboard;

// =====================================================
// STYLES
// =====================================================

const styles = {
  container: {
    padding: "20px",
  },

  // =====================================================
  // MATCH CARD
  // =====================================================

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
    display: "block",
    margin: "auto",
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

  // =====================================================
  // VS
  // =====================================================

  vs: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  // =====================================================
  // MATCH INFO
  // =====================================================

  matchInfo: {
    marginBottom: "15px",
  },

  // =====================================================
  // MATCH DETAILS
  // =====================================================

  detailsButton: {
    display: "inline-block",
    padding: "9px 15px",
    backgroundColor: "#007bff",
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
