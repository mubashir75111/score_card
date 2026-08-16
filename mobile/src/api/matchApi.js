import API from './api';

// =========================
// GET MATCHES
// =========================

export const getMatches = async (page = 1, limit = 5, status) => {
  const response = await API.get('/matches/matcheslist', {
    params: {
      page,
      limit,
      status,
    },
  });

  return response.data;
};

// =========================
// GET SINGLE MATCH
// =========================

export const getMatch = async id => {
  const response = await API.get(`/matches/${id}`);

  return response.data;
};

// =========================
// ADD MATCH WITH PICTURES
// =========================

export const addMatch = async data => {
  const response = await API.post('/matches/match', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// =========================
// UPDATE MATCH WITH PICTURES
// =========================

export const updateMatch = async (id, data) => {
  const response = await API.put(`/matches/matchupdate/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// =========================
// DELETE MATCH
// =========================

export const deleteMatch = async id => {
  const response = await API.delete(`/matches/matchdelete/${id}`);

  return response.data;
};

// =========================
// ADD PLAYER WITH PICTURE
// =========================

export const addplayer = async data => {
  const response = await API.post('/matches/addplayer', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// =========================
// GET PLAYERS
// =========================

export const getPlayers = async id => {
  const response = await API.get(`/matches/players/${id}`);

  return response.data;
};

// =========================
// GET SCORE
// =========================

export const getScore = async id => {
  const response = await API.get(`/matches/score/${id}`);

  return response.data;
};

// =========================
// ADD SHOTS
// =========================

export const addshots = async data => {
  const response = await API.post('/matches/addshots', data);

  return response.data;
};

// =========================
// GET MATCH DETAILS
// =========================

export const getMatcheDetails = async id => {
  const response = await API.get(`/matches/matchDetails/${id}`);

  return response.data;
};

// =========================
// COMPLETE / UPDATE MATCH STATUS
// =========================

export const MatchStatusUpdate = async id => {
  const response = await API.put(`/matches/MatchStatusUpdate/${id}`);

  return response.data;
};
