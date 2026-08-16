import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/Api";

const IMAGE_BASE_URL = "http://localhost:5000";

// =====================================================
// GET MATCH DETAILS
// =====================================================

const getMatcheDetails = async (id) => {
  const response = await API.get(`/matches/matchDetails/${id}`);
  return response.data;
};

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  // Backend already complete URL
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

  // Only filename
  return `${IMAGE_BASE_URL}/uploads/${imagePath}`;
};

// =====================================================
// MATCH DETAILS
// =====================================================

function MatchDetails() {
  const { id } = useParams();

  // =====================================================
  // GET DATA
  // =====================================================

  const {
    data: matches,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["matchDetails", id],
    queryFn: () => getMatcheDetails(id),
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <h2>Loading Match Details...</h2>;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    console.log(error);

    return <h2>Error loading match details</h2>;
  }

  // =====================================================
  // MATCH DATA
  // =====================================================

  const match = matches?.Match;

  const teamAImage = getImageUrl(match?.Team_A_Pic);
  const teamBImage = getImageUrl(match?.Team_B_Pic);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={{ padding: "20px" }}>
      {/* =====================================================
          LIVE SCORE
      ===================================================== */}

      <div
        style={{
          border: "2px solid black",
          borderRadius: "10px",
          padding: "25px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h2>Match Score</h2>

        {/* TEAMS + IMAGES */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
            marginTop: "20px",
          }}
        >
          {/* =====================================================
              TEAM A
          ===================================================== */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "150px",
            }}
          >
            {teamAImage ? (
              <img
                src={teamAImage}
                alt={match?.Team_A}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ccc",
                  marginBottom: "10px",
                }}
                onError={(event) => {
                  console.log(
                    "TEAM A IMAGE ERROR:",
                    teamAImage,
                    event.nativeEvent,
                  );
                }}
              />
            ) : (
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "35px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {match?.Team_A?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}

            <h2 style={{ margin: "5px 0" }}>{match?.Team_A || "Team A"}</h2>

            <div
              style={{
                fontSize: "50px",
                fontWeight: "bold",
              }}
            >
              {matches?.Team_A_Goals || 0}
            </div>
          </div>

          {/* =====================================================
              VS
          ===================================================== */}

          <div
            style={{
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            VS
          </div>

          {/* =====================================================
              TEAM B
          ===================================================== */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "150px",
            }}
          >
            {teamBImage ? (
              <img
                src={teamBImage}
                alt={match?.Team_B}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ccc",
                  marginBottom: "10px",
                }}
                onError={(event) => {
                  console.log(
                    "TEAM B IMAGE ERROR:",
                    teamBImage,
                    event.nativeEvent,
                  );
                }}
              />
            ) : (
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "35px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {match?.Team_B?.charAt(0)?.toUpperCase() || "B"}
              </div>
            )}

            <h2 style={{ margin: "5px 0" }}>{match?.Team_B || "Team B"}</h2>

            <div
              style={{
                fontSize: "50px",
                fontWeight: "bold",
              }}
            >
              {matches?.Team_B_Goals || 0}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MATCH DETAILS
      ===================================================== */}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h3>Match Details</h3>

        <p>
          <strong>Match ID:</strong> {match?.id}
        </p>

        <p>
          <strong>Venue:</strong> {match?.Venue || "N/A"}
        </p>

        <p>
          <strong>Start Time:</strong>{" "}
          {match?.Start_Time
            ? new Date(match.Start_Time).toLocaleString()
            : "N/A"}
        </p>

        <p>
          <strong>Status:</strong> {match?.Status || "N/A"}
        </p>
      </div>

      {/* =====================================================
          PLAYERS
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
          marginBottom: "20px",
        }}
      >
        {/* =====================================================
            TEAM A PLAYERS
        ===================================================== */}

        <div
          style={{
            width: "50%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
          }}
        >
          <h3>{match?.Team_A} Players</h3>

          {matches?.Team_A_Players?.length > 0 ? (
            <div>
              {matches.Team_A_Players.map((player) => {
                const playerImage = getImageUrl(player.Player_Pic);

                return (
                  <div
                    key={player.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {/* PLAYER IMAGE */}

                    {playerImage ? (
                      <img
                        src={playerImage}
                        alt={player.Player_name}
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          backgroundColor: "#ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          fontWeight: "bold",
                        }}
                      >
                        {player.Player_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}

                    {/* PLAYER NAME */}

                    <div>
                      <strong>{player.Player_name}</strong>

                      <br />

                      <small>{player.Team}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No players found</p>
          )}
        </div>

        {/* =====================================================
            TEAM B PLAYERS
        ===================================================== */}

        <div
          style={{
            width: "50%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
          }}
        >
          <h3>{match?.Team_B} Players</h3>

          {matches?.Team_B_Players?.length > 0 ? (
            <div>
              {matches.Team_B_Players.map((player) => {
                const playerImage = getImageUrl(player.Player_Pic);

                return (
                  <div
                    key={player.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {/* PLAYER IMAGE */}

                    {playerImage ? (
                      <img
                        src={playerImage}
                        alt={player.Player_name}
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          backgroundColor: "#ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          fontWeight: "bold",
                        }}
                      >
                        {player.Player_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}

                    {/* PLAYER NAME */}

                    <div>
                      <strong>{player.Player_name}</strong>

                      <br />

                      <small>{player.Team}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No players found</p>
          )}
        </div>
      </div>

      {/* =====================================================
          GOAL SCORERS
      ===================================================== */}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
        }}
      >
        <h3>Goal Scorers</h3>

        {matches?.GoalScorers?.length > 0 ? (
          <div>
            {matches.GoalScorers.map((goal, index) => {
              const goalImage = getImageUrl(goal.Player_Pic);

              return (
                <div
                  key={goal.id || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "12px",
                    marginBottom: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {/* GOAL SCORER IMAGE */}

                  {goalImage ? (
                    <img
                      src={goalImage}
                      alt={goal.Player_Name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      {goal.Player_Name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}

                  {/* GOAL INFORMATION */}

                  <div>
                    <strong>
                      {index + 1}. {goal.Player_Name || "Unknown Player"}
                    </strong>

                    <br />

                    <span>Team: {goal.Team || "-"}</span>

                    <br />

                    <span>Shot: {goal.Shot_Type || "-"}</span>

                    {goal.createdAt && (
                      <>
                        <br />

                        <span>
                          Time: {new Date(goal.createdAt).toLocaleTimeString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No Goals Yet</p>
        )}
      </div>
    </div>
  );
}

export default MatchDetails;
