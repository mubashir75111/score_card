import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  Button,
  Image,
} from 'react-native';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addshots,
  getPlayers,
  getScore,
  MatchStatusUpdate,
} from '../api/matchApi';

import { SERVER_URL } from '../api/api';

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = imagePath => {
  if (!imagePath) {
    return null;
  }

  // Backend already complete URL bhej raha hai
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // /uploads/filename.jpg
  if (imagePath.startsWith('/uploads/')) {
    return `${SERVER_URL}${imagePath}`;
  }

  // uploads/filename.jpg
  if (imagePath.startsWith('uploads/')) {
    return `${SERVER_URL}/${imagePath}`;
  }

  // Sirf filename.jpg
  return `${SERVER_URL}/uploads/${imagePath}`;
};

// =====================================================
// START MATCH
// =====================================================

const StartMatch = ({ route, navigation }) => {
  const { id } = route.params;

  const queryClient = useQueryClient();

  // =====================================================
  // FORM STATES
  // =====================================================

  const [Team, setTeam] = useState('');
  const [Player_id, setPlayer_id] = useState('');
  const [Shot_type, setShot_type] = useState('');
  const [Is_goal, setIs_goal] = useState(false);

  // =====================================================
  // GET PLAYERS
  // =====================================================

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['players', id],
    queryFn: () => getPlayers(id),
  });

  // =====================================================
  // LIVE SCORE
  // =====================================================

  const { data: scoreData } = useQuery({
    queryKey: ['score', id],
    queryFn: () => getScore(id),
    refetchInterval: 2000,
  });

  // =====================================================
  // COMPLETE MATCH
  // =====================================================

  const handleMatchStatusUpdate = async matchId => {
    try {
      await MatchStatusUpdate(matchId);

      Alert.alert('Success', 'Match completed successfully');

      await queryClient.invalidateQueries({
        queryKey: ['matches'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['score', id],
      });

      navigation.navigate('Dashboard');
    } catch (error) {
      console.log('Match Status Error:', error.response?.data || error.message);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Match complete nahi ho saka',
      );
    }
  };

  // =====================================================
  // ADD SHOT MUTATION
  // =====================================================

  const addshotMutation = useMutation({
    mutationFn: () =>
      addshots({
        Match_id: id,
        Player_id: Number(Player_id),
        Shot_type: Shot_type,
        Is_goal: Is_goal,
        Team: Team,
      }),

    onSuccess: () => {
      Alert.alert('Success', 'Shot Added Successfully');

      setTeam('');
      setPlayer_id('');
      setShot_type('');
      setIs_goal(false);

      queryClient.invalidateQueries({
        queryKey: ['score', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['players', id],
      });
    },

    onError: error => {
      console.log('Add Shot Error:', error.response?.data || error.message);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Shot add nahi ho saka',
      );
    },
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading Match...</Text>
      </View>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Error loading match</Text>

        <Text>{error?.message || String(error)}</Text>
      </View>
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
  // FILTER PLAYERS BY TEAM
  // =====================================================

  const filteredPlayers = players.filter(player => player.Team === Team);

  // =====================================================
  // SUBMIT SHOT
  // =====================================================

  const handleSubmit = () => {
    if (!Team) {
      Alert.alert('Error', 'Please select a team');
      return;
    }

    if (!Player_id) {
      Alert.alert('Error', 'Please select a player');
      return;
    }

    if (!Shot_type) {
      Alert.alert('Error', 'Please select shot type');
      return;
    }

    addshotMutation.mutate();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <ScrollView style={styles.container}>
      {/* =====================================================
          TITLE
      ===================================================== */}

      <Text style={styles.title}>Start Match</Text>

      {/* =====================================================
          LIVE SCORE
      ===================================================== */}

      {scoreData && (
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Live Score</Text>

          <View style={styles.liveScoreRow}>
            {/* =================================================
                TEAM A LIVE SCORE
            ================================================= */}

            <View style={styles.liveTeamBox}>
              {teamAImage ? (
                <Image
                  source={{ uri: teamAImage }}
                  style={styles.liveTeamImage}
                  resizeMode="cover"
                  onError={event => {
                    console.log(
                      'LIVE TEAM A IMAGE ERROR:',
                      teamAImage,
                      event.nativeEvent,
                    );
                  }}
                />
              ) : (
                <View style={styles.liveTeamPlaceholder}>
                  <Text style={styles.liveTeamPlaceholderText}>
                    {(scoreData.match?.Team_A || match?.Team_A || 'A')
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>
              )}

              <Text style={styles.liveTeamName}>
                {scoreData.match?.Team_A || match?.Team_A || 'Team A'}
              </Text>

              <Text style={styles.liveTeamScore}>
                {scoreData.score?.teamA || 0}
              </Text>
            </View>

            {/* =================================================
                VS
            ================================================= */}

            <View style={styles.liveVsBox}>
              <Text style={styles.liveVsText}>VS</Text>
            </View>

            {/* =================================================
                TEAM B LIVE SCORE
            ================================================= */}

            <View style={styles.liveTeamBox}>
              {teamBImage ? (
                <Image
                  source={{ uri: teamBImage }}
                  style={styles.liveTeamImage}
                  resizeMode="cover"
                  onError={event => {
                    console.log(
                      'LIVE TEAM B IMAGE ERROR:',
                      teamBImage,
                      event.nativeEvent,
                    );
                  }}
                />
              ) : (
                <View style={styles.liveTeamPlaceholder}>
                  <Text style={styles.liveTeamPlaceholderText}>
                    {(scoreData.match?.Team_B || match?.Team_B || 'B')
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>
              )}

              <Text style={styles.liveTeamName}>
                {scoreData.match?.Team_B || match?.Team_B || 'Team B'}
              </Text>

              <Text style={styles.liveTeamScore}>
                {scoreData.score?.teamB || 0}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* =====================================================
          SELECT TEAM
      ===================================================== */}

      <Text style={styles.label}>Select Team</Text>

      <View style={styles.row}>
        {/* =================================================
            TEAM A
        ================================================= */}

        <TouchableOpacity
          style={[
            styles.teamButton,
            Team === match?.Team_A && styles.selectedButton,
          ]}
          onPress={() => {
            setTeam(match?.Team_A || '');
            setPlayer_id('');
          }}
        >
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
              <Text style={styles.teamImagePlaceholderText}>
                {match?.Team_A?.charAt(0)?.toUpperCase() || 'A'}
              </Text>
            </View>
          )}

          <Text style={styles.buttonText}>{match?.Team_A}</Text>
        </TouchableOpacity>

        {/* =================================================
            TEAM B
        ================================================= */}

        <TouchableOpacity
          style={[
            styles.teamButton,
            Team === match?.Team_B && styles.selectedButton,
          ]}
          onPress={() => {
            setTeam(match?.Team_B || '');
            setPlayer_id('');
          }}
        >
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
              <Text style={styles.teamImagePlaceholderText}>
                {match?.Team_B?.charAt(0)?.toUpperCase() || 'B'}
              </Text>
            </View>
          )}

          <Text style={styles.buttonText}>{match?.Team_B}</Text>
        </TouchableOpacity>
      </View>

      {/* =====================================================
          PLAYERS
      ===================================================== */}

      <Text style={styles.label}>Select Player</Text>

      {filteredPlayers.length === 0 ? (
        <Text style={styles.noPlayer}>
          {Team ? 'No players found for this team' : 'First select a team'}
        </Text>
      ) : (
        <View>
          {filteredPlayers.map(player => {
            const playerImage = getImageUrl(player.Player_Pic);

            console.log(
              'PLAYER IMAGE URL:',
              player.Player_name,
              player.Player_Pic,
              playerImage,
            );

            return (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerButton,
                  Player_id === String(player.id) && styles.selectedButton,
                ]}
                onPress={() => setPlayer_id(String(player.id))}
              >
                {/* PLAYER IMAGE */}

                {playerImage ? (
                  <Image
                    source={{ uri: playerImage }}
                    style={styles.playerImage}
                    resizeMode="cover"
                    onError={event => {
                      console.log(
                        'PLAYER IMAGE ERROR:',
                        playerImage,
                        event.nativeEvent,
                      );
                    }}
                    onLoad={() => {
                      console.log('PLAYER IMAGE LOADED:', playerImage);
                    }}
                  />
                ) : (
                  <View style={styles.noImage}>
                    <Text style={styles.noImageText}>
                      {player.Player_name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}

                <Text style={styles.buttonText}>{player.Player_name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* =====================================================
          SHOT TYPE
      ===================================================== */}

      <Text style={styles.label}>Shot Type</Text>

      <View>
        {[
          'Goal',
          'Penalty',
          'Free Kick',
          'Header',
          'Long Shot',
          'Own Goal',
        ].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.playerButton,
              Shot_type === type && styles.selectedButton,
            ]}
            onPress={() => setShot_type(type)}
          >
            <Text style={styles.buttonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* =====================================================
          GOAL
      ===================================================== */}

      {Team ? (
        <>
          <Text style={styles.label}>Goal?</Text>

          <View style={styles.row}>
            {/* YES */}

            <TouchableOpacity
              style={[
                styles.teamButtonSmall,
                Is_goal === true && styles.selectedButton,
              ]}
              onPress={() => setIs_goal(true)}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            {/* NO */}

            <TouchableOpacity
              style={[
                styles.teamButtonSmall,
                Is_goal === false && styles.selectedButton,
              ]}
              onPress={() => setIs_goal(false)}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {/* =====================================================
          ADD SHOT
      ===================================================== */}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSubmit}
        disabled={addshotMutation.isPending}
      >
        {addshotMutation.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add Shot</Text>
        )}
      </TouchableOpacity>

      {/* =====================================================
          GOAL TIMELINE
      ===================================================== */}

      <Text style={styles.timelineTitle}>Goal Timeline</Text>

      {!scoreData || !scoreData.goals || scoreData.goals.length === 0 ? (
        <Text style={styles.noPlayer}>No Goals Yet</Text>
      ) : (
        scoreData.goals.map((goal, index) => {
          const player = scoreData.players?.find(p => p.id === goal.Player_id);

          const playerImage = getImageUrl(player?.Player_Pic);

          return (
            <View key={goal.id} style={styles.goalCard}>
              {/* PLAYER IMAGE */}

              {playerImage ? (
                <Image
                  source={{
                    uri: playerImage,
                  }}
                  style={styles.goalPlayerImage}
                  resizeMode="cover"
                  onError={event => {
                    console.log(
                      'GOAL IMAGE ERROR:',
                      playerImage,
                      event.nativeEvent,
                    );
                  }}
                />
              ) : (
                <View style={styles.goalNoImage}>
                  <Text style={styles.goalNoImageText}>
                    {player?.Player_name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}

              {/* GOAL INFORMATION */}

              <View style={styles.goalInfo}>
                <Text style={styles.goalText}>
                  {index + 1}. {player?.Player_name || 'Unknown Player'}
                </Text>

                <Text>Team: {player?.Team || goal.Team || '-'}</Text>

                <Text>Shot: {goal.Shot_type || '-'}</Text>

                <Text>
                  Time:{' '}
                  {goal.createdAt
                    ? new Date(goal.createdAt).toLocaleTimeString()
                    : 'N/A'}
                </Text>
              </View>
            </View>
          );
        })
      )}

      {/* =====================================================
          COMPLETE MATCH
      ===================================================== */}

      <View style={styles.completeButton}>
        <Button
          title="Complete The Match"
          onPress={() => {
            if (!match?.id) {
              Alert.alert('Error', 'Match ID not found');
              return;
            }

            Alert.alert(
              'Complete Match',
              'Are you sure you want to complete this match?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => handleMatchStatusUpdate(match.id),
                },
              ],
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

export default StartMatch;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  // =====================================================
  // LIVE SCORE
  // =====================================================

  scoreCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  liveScoreRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  liveTeamBox: {
    flex: 1,
    alignItems: 'center',
  },

  liveTeamImage: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#EEEEEE',
    marginBottom: 8,
  },

  liveTeamPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  liveTeamPlaceholderText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#555',
  },

  liveTeamName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  liveTeamScore: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },

  liveVsBox: {
    paddingHorizontal: 10,
  },

  liveVsText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#555',
  },

  // =====================================================
  // LABEL
  // =====================================================

  label: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  // =====================================================
  // TEAM BUTTON
  // =====================================================

  teamButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },

  teamButtonSmall: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
  },

  teamImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#EEEEEE',
  },

  teamImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  teamImagePlaceholderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555',
  },

  selectedButton: {
    borderWidth: 2,
    borderColor: '#007bff',
  },

  // =====================================================
  // PLAYERS
  // =====================================================

  playerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },

  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  noImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  noPlayer: {
    fontSize: 15,
    marginTop: 5,
  },

  // =====================================================
  // ADD SHOT
  // =====================================================

  addButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 25,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // =====================================================
  // GOAL TIMELINE
  // =====================================================

  timelineTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },

  goalCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  goalPlayerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  goalNoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  goalNoImageText: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  goalInfo: {
    flex: 1,
  },

  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  // =====================================================
  // COMPLETE MATCH
  // =====================================================

  completeButton: {
    marginTop: 20,
    marginBottom: 40,
  },

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  loadingText: {
    marginTop: 10,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
