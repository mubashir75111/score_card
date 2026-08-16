import React, { useState } from 'react';

import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getMatches, deleteMatch } from '../api/matchApi';

import { SERVER_URL } from '../api/api';

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) {
    return null;
  }

  // Backend already complete URL bhej raha ho
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
// HOME
// =====================================================

const Home = ({ navigation }: any) => {
  // =====================================================
  // CURRENT PAGE
  // =====================================================

  const [page, setPage] = useState(1);

  // Har page par 5 matches
  const limit = 5;

  // =====================================================
  // GET MATCHES
  // =====================================================

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['matches', 'Pending', page],
    queryFn: () => getMatches(page, limit, 'Pending'),
  });

  // =====================================================
  // QUERY CLIENT
  // =====================================================

  const queryClient = useQueryClient();

  // =====================================================
  // DELETE MATCH
  // =====================================================

  const deleteMutation = useMutation({
    mutationFn: deleteMatch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['matches'],
      });
    },

    onError: error => {
      console.log('Delete Match Error:', error);
    },
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text>Loading Matches...</Text>
      </View>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error loading matches</Text>

        <Text>{String(error)}</Text>
      </View>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const matches = data?.matches || [];

  const totalPages = data?.totalPages || 1;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score Card</Text>

      <FlatList
        data={matches}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          // =================================================
          // TEAM IMAGES
          // =================================================

          const teamAImage = getImageUrl(item.Team_A_Pic);

          const teamBImage = getImageUrl(item.Team_B_Pic);

          return (
            <View style={styles.matchCard}>
              {/* =============================================
                  TEAMS
              ============================================= */}

              <View style={styles.teamsContainer}>
                {/* =========================================
                    TEAM A
                ========================================= */}

                <View style={styles.teamContainer}>
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
                    <View style={styles.teamPlaceholder}>
                      <Text style={styles.placeholderText}>
                        {item.Team_A?.charAt(0)?.toUpperCase() || 'A'}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.teamName}>{item.Team_A || 'Team A'}</Text>
                </View>

                {/* =========================================
                    VS
                ========================================= */}

                <Text style={styles.vs}>VS</Text>

                {/* =========================================
                    TEAM B
                ========================================= */}

                <View style={styles.teamContainer}>
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
                    <View style={styles.teamPlaceholder}>
                      <Text style={styles.placeholderText}>
                        {item.Team_B?.charAt(0)?.toUpperCase() || 'B'}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.teamName}>{item.Team_B || 'Team B'}</Text>
                </View>
              </View>

              {/* =============================================
                  MATCH INFORMATION
              ============================================= */}

              <Text style={styles.info}>Venue: {item.Venue || 'N/A'}</Text>

              <Text style={styles.info}>
                Start Time:{' '}
                {item.Start_Time
                  ? new Date(item.Start_Time).toLocaleString()
                  : 'N/A'}
              </Text>

              {/* =============================================
                  UPDATE
              ============================================= */}

              <Button
                title="Update Match"
                onPress={() =>
                  navigation.navigate('MatchUpdate', {
                    id: item.id,
                  })
                }
              />

              {/* =============================================
                  DELETE
              ============================================= */}

              <Button
                title={
                  deleteMutation.isPending ? 'Deleting...' : 'Delete Match'
                }
                disabled={deleteMutation.isPending}
                onPress={() => deleteMutation.mutate(item.id)}
              />

              {/* =============================================
                  ADD PLAYERS
              ============================================= */}

              <Button
                title="Add Players"
                onPress={() =>
                  navigation.navigate('AddPlayers', {
                    id: item.id,
                  })
                }
              />

              {/* =============================================
                  START MATCH
              ============================================= */}

              <Button
                title="Start Match"
                onPress={() =>
                  navigation.navigate('StartMatch', {
                    id: item.id,
                  })
                }
              />
            </View>
          );
        }}
      />

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <View style={styles.pagination}>
        <Button
          title="Previous"
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
        />

        <Text style={styles.pageText}>
          Page {page} of {totalPages}
        </Text>

        <Button
          title="Next"
          disabled={page === totalPages}
          onPress={() => setPage(page + 1)}
        />
      </View>

      {/* =====================================================
          GO TO MATCH
      ===================================================== */}

      <Button
        title="Go to Match"
        onPress={() => navigation.navigate('Match')}
      />

      {/* =====================================================
          GO TO DASHBOARD
      ===================================================== */}

      <Button
        title="Go to Dashboard"
        onPress={() => navigation.navigate('Dashboard')}
      />
    </View>
  );
};

export default Home;

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
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  // =====================================================
  // MATCH CARD
  // =====================================================

  matchCard: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 8,
  },

  // =====================================================
  // TEAMS
  // =====================================================

  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },

  teamImage: {
    width: 75,
    height: 75,
    borderRadius: 38,
    marginBottom: 8,
    backgroundColor: '#eeeeee',
  },

  teamPlaceholder: {
    width: 75,
    height: 75,
    borderRadius: 38,
    marginBottom: 8,
    backgroundColor: '#dddddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555555',
  },

  teamName: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // =====================================================
  // VS
  // =====================================================

  vs: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },

  // =====================================================
  // MATCH INFORMATION
  // =====================================================

  info: {
    fontSize: 15,
    marginBottom: 8,
  },

  // =====================================================
  // PAGINATION
  // =====================================================

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },

  pageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
