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

import { useQuery } from '@tanstack/react-query';
import { getMatches } from '../api/matchApi';

// =====================================================
// IMAGE BASE URL
// =====================================================

import { SERVER_URL } from '../api/api';

// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = ({ navigation }: any) => {
  // Current page
  const [page, setPage] = useState(1);

  // Har page par 5 matches
  const limit = 5;

  // =====================================================
  // GET COMPLETED MATCHES
  // =====================================================

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['matches', 'Completed', page],
    queryFn: () => getMatches(page, limit, 'Completed'),
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
      <Text style={styles.title}>Completed Matches</Text>

      <FlatList
        data={matches}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.matchCard}>
            {/* =================================================
                TEAMS
            ================================================= */}

            <View style={styles.teamsContainer}>
              {/* ================= TEAM A ================= */}

              <View style={styles.teamContainer}>
                {item.Team_A_Pic ? (
                  <Image
                    source={{
                      uri: `${SERVER_URL}${item.Team_A_Pic}`,
                    }}
                    style={styles.teamImage}
                  />
                ) : (
                  <View style={styles.teamPlaceholder}>
                    <Text style={styles.placeholderText}>
                      {item.Team_A?.charAt(0)?.toUpperCase() || 'A'}
                    </Text>
                  </View>
                )}

                <Text style={styles.teamName}>{item.Team_A}</Text>
              </View>

              {/* ================= VS ================= */}

              <Text style={styles.vs}>VS</Text>

              {/* ================= TEAM B ================= */}

              <View style={styles.teamContainer}>
                {item.Team_B_Pic ? (
                  <Image
                    source={{
                      uri: `${SERVER_URL}${item.Team_B_Pic}`,
                    }}
                    style={styles.teamImage}
                  />
                ) : (
                  <View style={styles.teamPlaceholder}>
                    <Text style={styles.placeholderText}>
                      {item.Team_B?.charAt(0)?.toUpperCase() || 'B'}
                    </Text>
                  </View>
                )}

                <Text style={styles.teamName}>{item.Team_B}</Text>
              </View>
            </View>

            {/* =================================================
                MATCH INFORMATION
            ================================================= */}

            <Text>Venue: {item.Venue}</Text>

            <Text>
              Start Time:{' '}
              {item.Start_Time
                ? new Date(item.Start_Time).toLocaleString()
                : 'N/A'}
            </Text>

            {/* =================================================
                MATCH DETAILS
            ================================================= */}

            <View style={styles.detailsButton}>
              <Button
                title="Match Details"
                onPress={() =>
                  navigation.navigate('MatchDetails', {
                    id: item.id,
                  })
                }
              />
            </View>
          </View>
        )}
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
          NAVIGATION
      ===================================================== */}

      <Button
        title="Go to Match"
        onPress={() => navigation.navigate('Match')}
      />

      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default Dashboard;

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
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

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
    marginBottom: 15,
  },

  teamContainer: {
    width: 120,
    alignItems: 'center',
  },

  teamImage: {
    width: 75,
    height: 75,
    borderRadius: 40,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },

  teamPlaceholder: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },

  vs: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },

  // =====================================================
  // BUTTON
  // =====================================================

  detailsButton: {
    marginTop: 12,
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
