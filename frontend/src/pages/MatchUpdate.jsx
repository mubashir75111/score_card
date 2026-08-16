import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/Api";

const getMatch = async (id) => {
  const response = await API.get(`/matches/${id}`);
  return response.data;
};

function MatchUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [Team_A, setTeam_A] = useState("");
  const [Team_B, setTeam_B] = useState("");
  const [Venue, setVenue] = useState("");
  const [Start_Time, setStart_Time] = useState("");

  // Pictures
  const [Team_A_Pic, setTeam_A_Pic] = useState(null);
  const [Team_B_Pic, setTeam_B_Pic] = useState(null);

  const [oldTeamAPic, setOldTeamAPic] = useState("");
  const [oldTeamBPic, setOldTeamBPic] = useState("");

  // Get single match
  const { data, isLoading, error } = useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatch(id),
  });

  // API se data aane ke baad form fill
  useEffect(() => {
    if (data) {
      console.log("MATCH DATA:", data);

      setTeam_A(data.Team_A || "");
      setTeam_B(data.Team_B || "");
      setVenue(data.Venue || "");

      if (data.Start_Time) {
        setStart_Time(data.Start_Time.slice(0, 16));
      }

      // Purani pictures
      setOldTeamAPic(data.Team_A_Pic || "");
      setOldTeamBPic(data.Team_B_Pic || "");
    }
  }, [data]);

  // Update mutation
  const updateMatch = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("Team_A", Team_A);
      formData.append("Team_B", Team_B);
      formData.append("Venue", Venue);
      formData.append("Start_Time", Start_Time);

      // Sirf new picture select hui ho to bhejo
      if (Team_A_Pic) {
        formData.append("Team_A_Pic", Team_A_Pic);
      }

      if (Team_B_Pic) {
        formData.append("Team_B_Pic", Team_B_Pic);
      }

      return await API.put(`/matches/matchupdate/${id}`, formData);
    },

    onSuccess: () => {
      alert("Match Updated Successfully");

      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });

      queryClient.invalidateQueries({
        queryKey: ["match", id],
      });

      navigate("/home");
    },

    onError: (error) => {
      console.log(error.response?.data || error.message);

      alert("Match Update Failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    updateMatch.mutate();
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error loading match</h2>;
  }

  return (
    <div className="container mt-5">
      <h2>Update Match</h2>

      <form onSubmit={handleSubmit}>
        {/* TEAM A */}
        <div className="mb-3">
          <label className="form-label">Team A</label>

          <input
            type="text"
            className="form-control"
            value={Team_A}
            onChange={(e) => setTeam_A(e.target.value)}
          />
        </div>

        {/* TEAM A OLD PICTURE */}
        {oldTeamAPic && (
          <div className="mb-3">
            <label className="form-label">Current Team A Picture</label>

            <br />

            <img
              src={`http://localhost:5000${oldTeamAPic}`}
              alt="Team A"
              width="100"
              height="100"
              style={{
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* TEAM A NEW PICTURE */}
        <div className="mb-3">
          <label className="form-label">Change Team A Picture</label>

          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => setTeam_A_Pic(e.target.files[0])}
          />
        </div>

        {/* TEAM B */}
        <div className="mb-3">
          <label className="form-label">Team B</label>

          <input
            type="text"
            className="form-control"
            value={Team_B}
            onChange={(e) => setTeam_B(e.target.value)}
          />
        </div>

        {/* TEAM B OLD PICTURE */}
        {oldTeamBPic && (
          <div className="mb-3">
            <label className="form-label">Current Team B Picture</label>

            <br />

            <img
              src={`http://localhost:5000${oldTeamBPic}`}
              alt="Team B"
              width="100"
              height="100"
              style={{
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* TEAM B NEW PICTURE */}
        <div className="mb-3">
          <label className="form-label">Change Team B Picture</label>

          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => setTeam_B_Pic(e.target.files[0])}
          />
        </div>

        {/* VENUE */}
        <div className="mb-3">
          <label className="form-label">Venue</label>

          <input
            type="text"
            className="form-control"
            value={Venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>

        {/* START TIME */}
        <div className="mb-3">
          <label className="form-label">Start Time</label>

          <input
            type="datetime-local"
            className="form-control"
            value={Start_Time}
            onChange={(e) => setStart_Time(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={updateMatch.isPending}
        >
          {updateMatch.isPending ? "Updating..." : "Update Match"}
        </button>
      </form>
    </div>
  );
}

export default MatchUpdate;
