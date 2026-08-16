import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/Api";

const getMatch = async (id) => {
  const response = await API.get(`/matches/${id}`);
  return response.data;
};

function AddPlayers() {
  const { id } = useParams();

  const [Team, setTeam] = useState("");
  const [Player_name, setPlayer_name] = useState("");
  const [Player_Pic, setPlayer_Pic] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatch(id),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!Team) {
      alert("Please select a team.");
      return;
    }

    if (!Player_name.trim()) {
      alert("Please enter player name.");
      return;
    }

    if (!Player_Pic) {
      alert("Please select player picture.");
      return;
    }

    try {
      const formData = new FormData();

      // Match ID
      formData.append("id", id);

      // Team
      formData.append("Team", Team);

      // Player Name
      formData.append("Player_name", Player_name.trim());

      // Player Picture - REQUIRED
      formData.append("Player_Pic", Player_Pic);

      const response = await API.post("/matches/addplayer", formData);

      console.log(response.data);

      alert("Player Added Successfully");

      // Clear form
      setTeam("");
      setPlayer_name("");
      setPlayer_Pic(null);

      // File input reset
      document.getElementById("playerPic").value = "";
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Player Add Failed");
    }
  };

  if (isLoading) {
    return <h2>Loading Match...</h2>;
  }

  if (error) {
    return <h2>Error loading match</h2>;
  }

  return (
    <div className="container mt-5">
      <h2>Add Players</h2>

      <form onSubmit={handleSubmit}>
        {/* =========================
            SELECT TEAM
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Select Team</label>

          <select
            className="form-select"
            value={Team}
            onChange={(e) => setTeam(e.target.value)}
            required
          >
            <option value="">Select Team</option>

            <option value={data?.Team_A}>{data?.Team_A}</option>

            <option value={data?.Team_B}>{data?.Team_B}</option>
          </select>
        </div>

        {/* =========================
            PLAYER NAME
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Enter Player Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Player Name"
            value={Player_name}
            onChange={(e) => setPlayer_name(e.target.value)}
            required
          />
        </div>

        {/* =========================
            PLAYER PICTURE
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Player Picture</label>

          <input
            id="playerPic"
            type="file"
            className="form-control"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => {
              setPlayer_Pic(e.target.files[0] || null);
            }}
            required
          />

          {/* Picture Preview */}
          {Player_Pic && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(Player_Pic)}
                alt="Player Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setPlayer_Pic(null);
                    document.getElementById("playerPic").value = "";
                  }}
                >
                  Remove Picture
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            SUBMIT
        ========================= */}

        <button type="submit" className="btn btn-primary">
          Add Player
        </button>
      </form>
    </div>
  );
}

export default AddPlayers;
