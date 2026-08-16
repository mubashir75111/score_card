import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/Api";

const getScore = async (id) => {
  const response = await API.get(`/matches/score/${id}`);
  return response.data;
};

function LiveScore() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["score", id],
    queryFn: () => getScore(id),
    refetchInterval: 3000,
  });

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Live Match</h1>

      <h2>
        {data.match.Team_A} {data.score.teamA} - {data.score.teamB}{" "}
        {data.match.Team_B}
      </h2>

      <hr />

      <h3>Goals Timeline</h3>

      {data.goals.length === 0 ? (
        <p>No Goals Yet</p>
      ) : (
        data.goals.map((goal, index) => {
          const player = data.players.find((p) => p.id === goal.Player_id);

          return (
            <div key={goal.id}>
              <strong>{index + 1}.</strong> {player?.Player_name} (
              {player?.Team})
              <br />
              {goal.Shot_type}
              <br />
              {new Date(goal.createdAt).toLocaleTimeString()}
              <hr />
            </div>
          );
        })
      )}
    </div>
  );
}

export default LiveScore;
