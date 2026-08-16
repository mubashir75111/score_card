import { useState } from "react";
import API from "../services/Api";

function Match() {
  const [Team_A, setTeamA] = useState("");
  const [Team_B, setTeamB] = useState("");
  const [Venue, setVenue] = useState("");
  const [Start_Time, setStartTime] = useState("");

  const [Team_A_Pic, setTeamAPic] = useState(null);
  const [Team_B_Pic, setTeamBPic] = useState(null);

  // =========================
  // SUBMIT MATCH
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!Team_A.trim()) {
      alert("Please enter Team A name");
      return;
    }

    if (!Team_A_Pic) {
      alert("Please select Team A picture");
      return;
    }

    if (!Team_B.trim()) {
      alert("Please enter Team B name");
      return;
    }

    if (!Team_B_Pic) {
      alert("Please select Team B picture");
      return;
    }

    if (!Venue.trim()) {
      alert("Please enter Venue");
      return;
    }

    if (!Start_Time) {
      alert("Please select Start Time");
      return;
    }

    try {
      const formData = new FormData();

      // =========================
      // TEXT FIELDS
      // =========================

      formData.append("Team_A", Team_A.trim());
      formData.append("Team_B", Team_B.trim());
      formData.append("Venue", Venue.trim());
      formData.append("Start_Time", Start_Time);

      // =========================
      // TEAM A PICTURE
      // =========================

      formData.append("Team_A_Pic", Team_A_Pic);

      // =========================
      // TEAM B PICTURE
      // =========================

      formData.append("Team_B_Pic", Team_B_Pic);

      // =========================
      // API REQUEST
      // =========================

      const response = await API.post("/matches/match", formData);

      console.log(response.data);

      alert("Match Added Successfully");

      // =========================
      // CLEAR FORM
      // =========================

      setTeamA("");
      setTeamB("");
      setVenue("");
      setStartTime("");

      setTeamAPic(null);
      setTeamBPic(null);

      // Clear file inputs
      document.getElementById("teamAPic").value = "";
      document.getElementById("teamBPic").value = "";
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Match Add Failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Match</h2>

      <form onSubmit={handleSubmit}>
        {/* =========================
            TEAM A NAME
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Team A Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Team A Name"
            value={Team_A}
            onChange={(e) => setTeamA(e.target.value)}
            required
          />
        </div>

        {/* =========================
            TEAM A PICTURE
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Team A Picture</label>

          <input
            id="teamAPic"
            type="file"
            className="form-control"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => setTeamAPic(e.target.files[0] || null)}
            required
          />

          {/* Preview */}
          {Team_A_Pic && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(Team_A_Pic)}
                alt="Team A"
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
                    setTeamAPic(null);
                    document.getElementById("teamAPic").value = "";
                  }}
                >
                  Remove Team A Picture
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            TEAM B NAME
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Team B Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Team B Name"
            value={Team_B}
            onChange={(e) => setTeamB(e.target.value)}
            required
          />
        </div>

        {/* =========================
            TEAM B PICTURE
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Team B Picture</label>

          <input
            id="teamBPic"
            type="file"
            className="form-control"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => setTeamBPic(e.target.files[0] || null)}
            required
          />

          {/* Preview */}
          {Team_B_Pic && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(Team_B_Pic)}
                alt="Team B"
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
                    setTeamBPic(null);
                    document.getElementById("teamBPic").value = "";
                  }}
                >
                  Remove Team B Picture
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            VENUE
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Venue</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Venue Name"
            value={Venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />
        </div>

        {/* =========================
            START TIME
        ========================= */}

        <div className="mb-3">
          <label className="form-label">Start Time</label>

          <input
            type="datetime-local"
            className="form-control"
            value={Start_Time}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        {/* =========================
            SAVE
        ========================= */}

        <button type="submit" className="btn btn-primary">
          Save Match
        </button>
      </form>
    </div>
  );
}

export default Match;
