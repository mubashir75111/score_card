import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { getMatcheDetails } from '../api/matchApi';
import { SERVER_URL } from '../api/api';

const MatchDetails = ({ route }) => {
  // Match ID
  const { id } = route.params;

  // =========================
  // GET MATCH DETAILS
  // =========================

  const {
    data: matches,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['matchDetails', id],
    queryFn: () => getMatcheDetails(id),
  });

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = imagePath => {
    if (!imagePath) {
      return null;
    }

    // Agar backend already complete URL bhej raha hai
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // /uploads/file.jpg
    if (imagePath.startsWith('/uploads/')) {
      return `${SERVER_URL}${imagePath}`;
    }

    // uploads/file.jpg
    if (imagePath.startsWith('uploads/')) {
      return `${SERVER_URL}/${imagePath}`;
    }

    // sirf filename.jpg
    return `${SERVER_URL}/uploads/${imagePath}`;
  };

  // =========================
  // PLAYER IMAGE
  // =========================

  const getPlayerImage = player => {
    if (!player?.Player_Pic) {
      return null;
    }

    return getImageUrl(player.Player_Pic);
  };

  // =========================
  // TEAM IMAGE
  // =========================

  const getTeamImage = teamImage => {
    return getImageUrl(teamImage);
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading Match...</Text>
      </View>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Error loading match</Text>

        <Text style={styles.errorText}>{error?.message || String(error)}</Text>
      </View>
    );
  }

  // =========================
  // NO DATA
  // =========================

  if (!matches) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No match data found</Text>
      </View>
    );
  }

  // =========================
  // DATA
  // =========================

  const match = matches.Match;

  const teamAPlayers = matches.Team_A_Players || [];
  const teamBPlayers = matches.Team_B_Players || [];
  const goalScorers = matches.GoalScorers || [];

  // =========================
  // TEAM IMAGES
  // =========================

  const teamAImage = getTeamImage(match?.Team_A_Pic);
  const teamBImage = getTeamImage(match?.Team_B_Pic);

  // =========================
  // RENDER
  // =========================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Details</Text>

        <Text style={styles.matchId}>Match #{match?.id}</Text>
      </View>

      {/* ================= SCORE CARD ================= */}

      <View style={styles.scoreCard}>
        <Text style={styles.liveText}>MATCH SCORE</Text>

        <View style={styles.teamsRow}>
          {/* ================= TEAM A ================= */}

          <View style={styles.teamBox}>
            {teamAImage ? (
              <Image
                source={{ uri: teamAImage }}
                style={styles.teamImage}
                resizeMode="cover"
                onError={event => {
                  console.log(
                    'TEAM A IMAGE ERROR:',
                    teamAImage,
                    event.nativeEvent,
                  );
                }}
              />
            ) : (
              <View style={styles.teamImagePlaceholder}>
                <Text style={styles.teamPlaceholderText}>
                  {match?.Team_A?.charAt(0)?.toUpperCase() || 'A'}
                </Text>
              </View>
            )}

            <Text style={styles.teamName}>{match?.Team_A}</Text>

            <Text style={styles.scoreNumber}>{matches.Team_A_Goals || 0}</Text>
          </View>

          {/* ================= VS ================= */}

          <View style={styles.vsBox}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* ================= TEAM B ================= */}

          <View style={styles.teamBox}>
            {teamBImage ? (
              <Image
                source={{ uri: teamBImage }}
                style={styles.teamImage}
                resizeMode="cover"
                onError={event => {
                  console.log(
                    'TEAM B IMAGE ERROR:',
                    teamBImage,
                    event.nativeEvent,
                  );
                }}
              />
            ) : (
              <View style={styles.teamImagePlaceholder}>
                <Text style={styles.teamPlaceholderText}>
                  {match?.Team_B?.charAt(0)?.toUpperCase() || 'B'}
                </Text>
              </View>
            )}

            <Text style={styles.teamName}>{match?.Team_B}</Text>

            <Text style={styles.scoreNumber}>{matches.Team_B_Goals || 0}</Text>
          </View>
        </View>
      </View>

      {/* ================= MATCH INFORMATION ================= */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Match Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Match ID</Text>

          <Text style={styles.infoValue}>{match?.id}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Venue</Text>

          <Text style={styles.infoValue}>{match?.Venue || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Start Time</Text>

          <Text style={styles.infoValue}>
            {match?.Start_Time
              ? new Date(match.Start_Time).toLocaleString()
              : '-'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>

          <Text style={styles.statusValue}>{match?.Status || '-'}</Text>
        </View>
      </View>

      {/* ================= TEAM A PLAYERS ================= */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{match?.Team_A} Players</Text>

        {teamAPlayers.length === 0 ? (
          <Text style={styles.noPlayers}>No players found</Text>
        ) : (
          teamAPlayers.map(player => {
            const playerImage = getPlayerImage(player);

            return (
              <View style={styles.playerRow} key={player.id}>
                {playerImage ? (
                  <Image
                    source={{ uri: playerImage }}
                    style={styles.playerImage}
                    resizeMode="cover"
                    onError={event => {
                      console.log(
                        'TEAM A PLAYER IMAGE ERROR:',
                        playerImage,
                        event.nativeEvent,
                      );
                    }}
                  />
                ) : (
                  <View style={styles.playerImagePlaceholder}>
                    <Text style={styles.placeholderText}>
                      {player.Player_name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.Player_name}</Text>

                  <Text style={styles.playerTeam}>{player.Team}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* ================= TEAM B PLAYERS ================= */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{match?.Team_B} Players</Text>

        {teamBPlayers.length === 0 ? (
          <Text style={styles.noPlayers}>No players found</Text>
        ) : (
          teamBPlayers.map(player => {
            const playerImage = getPlayerImage(player);

            return (
              <View style={styles.playerRow} key={player.id}>
                {playerImage ? (
                  <Image
                    source={{ uri: playerImage }}
                    style={styles.playerImage}
                    resizeMode="cover"
                    onError={event => {
                      console.log(
                        'TEAM B PLAYER IMAGE ERROR:',
                        playerImage,
                        event.nativeEvent,
                      );
                    }}
                  />
                ) : (
                  <View style={styles.playerImagePlaceholder}>
                    <Text style={styles.placeholderText}>
                      {player.Player_name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.Player_name}</Text>

                  <Text style={styles.playerTeam}>{player.Team}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* ================= GOAL SCORERS ================= */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Goal Scorers</Text>

        {goalScorers.length > 0 ? (
          goalScorers.map((scorer, index) => {
            const scorerImage = getPlayerImage(scorer);

            return (
              <View style={styles.scorerRow} key={scorer.id || index}>
                {scorerImage ? (
                  <Image
                    source={{ uri: scorerImage }}
                    style={styles.scorerImage}
                    resizeMode="cover"
                    onError={event => {
                      console.log(
                        'SCORER IMAGE ERROR:',
                        scorerImage,
                        event.nativeEvent,
                      );
                    }}
                  />
                ) : (
                  <View style={styles.scorerImagePlaceholder}>
                    <Text style={styles.scorerPlaceholderText}>
                      {(scorer.Player_Name || scorer.Player_name || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>
                )}

                <View style={styles.scorerInfo}>
                  <Text style={styles.scorerName}>
                    {scorer.Player_Name ||
                      scorer.Player_name ||
                      'Unknown Player'}
                  </Text>

                  <Text style={styles.scorerDetails}>{scorer.Team || '-'}</Text>

                  <Text style={styles.scorerDetails}>
                    Shot: {scorer.Shot_Type || scorer.Shot_type || '-'}
                  </Text>

                  {scorer.createdAt && (
                    <Text style={styles.scorerDetails}>
                      Time: {new Date(scorer.createdAt).toLocaleTimeString()}
                    </Text>
                  )}
                </View>

                <View style={styles.goalCircle}>
                  <Text style={styles.goalCircleText}>⚽</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noGoals}>No goals scored yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default MatchDetails;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  matchId: {
    fontSize: 14,
    marginTop: 4,
    color: '#64748B',
  },

  // =========================
  // SCORE CARD
  // =========================

  scoreCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },

  liveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  teamBox: {
    flex: 1,
    alignItems: 'center',
  },

  // =========================
  // TEAM IMAGE
  // =========================

  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },

  teamImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  teamPlaceholderText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#334155',
  },

  teamName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  scoreNumber: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 8,
  },

  vsBox: {
    paddingHorizontal: 12,
  },

  vsText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // =========================
  // GENERAL CARD
  // =========================

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  // =========================
  // MATCH INFORMATION
  // =========================

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  infoLabel: {
    fontSize: 15,
    color: '#64748B',
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },

  statusValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  // =========================
  // PLAYERS
  // =========================

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  playerImage: {
    width: 55,
    height: 55,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: '#E2E8F0',
  },

  playerImagePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
  },

  playerInfo: {
    flex: 1,
  },

  playerName: {
    fontSize: 16,
    fontWeight: '600',
  },

  playerTeam: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  noPlayers: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#64748B',
  },

  // =========================
  // GOAL SCORERS
  // =========================

  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  scorerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#E2E8F0',
  },

  scorerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scorerPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155',
  },

  scorerInfo: {
    flex: 1,
  },

  scorerName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  scorerDetails: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  goalCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  goalCircleText: {
    fontSize: 20,
  },

  noGoals: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#64748B',
  },

  // =========================
  // LOADING / ERROR
  // =========================

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
