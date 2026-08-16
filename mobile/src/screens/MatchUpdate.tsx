import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ScrollView,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getMatch, updateMatch } from '../api/matchApi';

// =====================================================
// SERVER URL
// IP YAHAN NAHI LIKHNA
// api.js se aa raha hai
// =====================================================

import { SERVER_URL } from '../api/api';

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = imagePath => {
  if (!imagePath) {
    return null;
  }

  // Agar backend complete URL bhej raha hai
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
// COMPONENT
// =====================================================

const MatchUpdate = ({ route, navigation }) => {
  const { id } = route.params;

  const queryClient = useQueryClient();

  // =====================================================
  // FORM STATES
  // =====================================================

  const [Team_A, setTeam_A] = useState('');
  const [Team_B, setTeam_B] = useState('');
  const [Venue, setVenue] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  // =====================================================
  // PICTURE STATES
  // =====================================================

  const [oldTeamAPic, setOldTeamAPic] = useState(null);
  const [oldTeamBPic, setOldTeamBPic] = useState(null);

  const [teamAPic, setTeamAPic] = useState(null);
  const [teamBPic, setTeamBPic] = useState(null);

  // =====================================================
  // GET MATCH
  // =====================================================

  const {
    data: match,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatch(id),
  });

  // =====================================================
  // FILL FORM
  // =====================================================

  useEffect(() => {
    if (match) {
      console.log('MATCH DATA:', match);

      setTeam_A(match.Team_A || '');
      setTeam_B(match.Team_B || '');
      setVenue(match.Venue || '');

      // Existing pictures
      setOldTeamAPic(match.Team_A_Pic || null);
      setOldTeamBPic(match.Team_B_Pic || null);

      // New pictures clear
      setTeamAPic(null);
      setTeamBPic(null);

      // Start time
      if (match.Start_Time) {
        const date = new Date(match.Start_Time);

        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
        }
      } else {
        setSelectedDate(new Date());
      }
    }
  }, [match]);

  // =====================================================
  // PICK TEAM A PICTURE
  // =====================================================

  const pickTeamAPic = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Image selection failed');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setTeamAPic(result.assets[0]);
    }
  };

  // =====================================================
  // PICK TEAM B PICTURE
  // =====================================================

  const pickTeamBPic = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Image selection failed');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setTeamBPic(result.assets[0]);
    }
  };

  // =====================================================
  // UPDATE MUTATION
  // =====================================================

  const updateMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();

      // =================================================
      // TEXT FIELDS
      // =================================================

      formData.append('Team_A', Team_A.trim());

      formData.append('Team_B', Team_B.trim());

      formData.append('Venue', Venue.trim());

      formData.append('Start_Time', selectedDate.toISOString());

      // =================================================
      // TEAM A NEW PICTURE
      // =================================================

      if (teamAPic) {
        formData.append('Team_A_Pic', {
          uri: teamAPic.uri,
          type: teamAPic.type || 'image/jpeg',
          name: teamAPic.fileName || `team_a_${Date.now()}.jpg`,
        });
      }

      // =================================================
      // TEAM B NEW PICTURE
      // =================================================

      if (teamBPic) {
        formData.append('Team_B_Pic', {
          uri: teamBPic.uri,
          type: teamBPic.type || 'image/jpeg',
          name: teamBPic.fileName || `team_b_${Date.now()}.jpg`,
        });
      }

      return updateMatch(id, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['match', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['matches'],
      });

      Alert.alert('Success', 'Match updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    },

    onError: error => {
      console.log('Update Match Error:', error.response?.data || error.message);

      Alert.alert(
        'Update Error',
        error.response?.data?.message || 'Something went wrong',
      );
    },
  });

  // =====================================================
  // HANDLE UPDATE
  // =====================================================

  const handleUpdate = () => {
    if (!Team_A.trim()) {
      Alert.alert('Error', 'Team A is required');
      return;
    }

    if (!Team_B.trim()) {
      Alert.alert('Error', 'Team B is required');
      return;
    }

    if (!Venue.trim()) {
      Alert.alert('Error', 'Venue is required');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Start Time is required');
      return;
    }

    updateMutation.mutate();
  };

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

        <Text style={styles.errorText}>{error?.message || String(error)}</Text>
      </View>
    );
  }

  // =====================================================
  // IMAGE URLS
  // =====================================================

  const teamAOldImage = getImageUrl(oldTeamAPic);

  const teamBOldImage = getImageUrl(oldTeamBPic);

  // =====================================================
  // UI
  // =====================================================

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Update Match</Text>

      {/* ================= TEAM A ================= */}

      <Text style={styles.label}>Team A</Text>

      <TextInput
        style={styles.input}
        value={Team_A}
        onChangeText={setTeam_A}
        placeholder="Enter Team A"
      />

      <Text style={styles.label}>Team A Picture</Text>

      {teamAPic ? (
        <Image
          source={{
            uri: teamAPic.uri,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : teamAOldImage ? (
        <Image
          source={{
            uri: teamAOldImage,
          }}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => console.log('TEAM A IMAGE LOADED:', teamAOldImage)}
          onError={e =>
            console.log('TEAM A IMAGE ERROR:', teamAOldImage, e.nativeEvent)
          }
        />
      ) : (
        <Text style={styles.noImage}>No Team A picture</Text>
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickTeamAPic}>
        <Text style={styles.imageButtonText}>
          {teamAPic ? 'Change Team A Picture' : 'Select Team A Picture'}
        </Text>
      </TouchableOpacity>

      {/* ================= TEAM B ================= */}

      <Text style={styles.label}>Team B</Text>

      <TextInput
        style={styles.input}
        value={Team_B}
        onChangeText={setTeam_B}
        placeholder="Enter Team B"
      />

      <Text style={styles.label}>Team B Picture</Text>

      {teamBPic ? (
        <Image
          source={{
            uri: teamBPic.uri,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : teamBOldImage ? (
        <Image
          source={{
            uri: teamBOldImage,
          }}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => console.log('TEAM B IMAGE LOADED:', teamBOldImage)}
          onError={e =>
            console.log('TEAM B IMAGE ERROR:', teamBOldImage, e.nativeEvent)
          }
        />
      ) : (
        <Text style={styles.noImage}>No Team B picture</Text>
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickTeamBPic}>
        <Text style={styles.imageButtonText}>
          {teamBPic ? 'Change Team B Picture' : 'Select Team B Picture'}
        </Text>
      </TouchableOpacity>

      {/* ================= VENUE ================= */}

      <Text style={styles.label}>Venue</Text>

      <TextInput
        style={styles.input}
        value={Venue}
        onChangeText={setVenue}
        placeholder="Enter Venue"
      />

      {/* ================= DATE ================= */}

      <Text style={styles.label}>Start Date</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{selectedDate.toISOString().slice(0, 10)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'android' ? 'calendar' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(false);

            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      {/* ================= TIME ================= */}

      <Text style={styles.label}>Start Time</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>
          {selectedDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);

            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      {/* ================= UPDATE BUTTON ================= */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Match</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MatchUpdate;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 5,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#E2E8F0',
  },

  noImage: {
    marginBottom: 10,
    color: '#777',
  },

  imageButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },

  imageButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  button: {
    marginTop: 25,
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
