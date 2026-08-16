import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';

import API from '../api/api';

const Match = () => {
  const [Team_A, setTeamA] = useState('');
  const [Team_B, setTeamB] = useState('');
  const [Venue, setVenue] = useState('');
  const [Start_Time, setStartTime] = useState('');

  const [Team_A_Pic, setTeamAPic] = useState(null);
  const [Team_B_Pic, setTeamBPic] = useState(null);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  // =========================
  // TEAM A IMAGE
  // =========================

  const selectTeamAPic = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Team A picture select nahi hui',
          );
          return;
        }

        if (response.assets && response.assets.length > 0) {
          setTeamAPic(response.assets[0]);
        }
      },
    );
  };

  // =========================
  // TEAM B IMAGE
  // =========================

  const selectTeamBPic = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Team B picture select nahi hui',
          );
          return;
        }

        if (response.assets && response.assets.length > 0) {
          setTeamBPic(response.assets[0]);
        }
      },
    );
  };

  // =========================
  // SAVE MATCH
  // =========================

  const saveMatch = async () => {
    try {
      // =========================
      // TEAM A NAME
      // =========================

      if (!Team_A.trim()) {
        Alert.alert('Error', 'Please enter Team A name');
        return;
      }

      // =========================
      // TEAM B NAME
      // =========================

      if (!Team_B.trim()) {
        Alert.alert('Error', 'Please enter Team B name');
        return;
      }

      // =========================
      // VENUE
      // =========================

      if (!Venue.trim()) {
        Alert.alert('Error', 'Please enter Venue');
        return;
      }

      // =========================
      // DATE / TIME
      // =========================

      if (!Start_Time) {
        Alert.alert('Error', 'Please select date and time');
        return;
      }

      // =========================
      // TEAM A PICTURE
      // =========================

      if (!Team_A_Pic?.uri) {
        Alert.alert('Error', 'Please select Team A picture');
        return;
      }

      // =========================
      // TEAM B PICTURE
      // =========================

      if (!Team_B_Pic?.uri) {
        Alert.alert('Error', 'Please select Team B picture');
        return;
      }

      // =========================
      // FORM DATA
      // =========================

      const formData = new FormData();

      formData.append('Team_A', Team_A.trim());

      formData.append('Team_B', Team_B.trim());

      formData.append('Venue', Venue.trim());

      formData.append('Start_Time', Start_Time);

      // =========================
      // TEAM A PICTURE
      // =========================

      formData.append('Team_A_Pic', {
        uri: Team_A_Pic.uri,
        type: Team_A_Pic.type || 'image/jpeg',
        name: Team_A_Pic.fileName || `team_a_${Date.now()}.jpg`,
      });

      // =========================
      // TEAM B PICTURE
      // =========================

      formData.append('Team_B_Pic', {
        uri: Team_B_Pic.uri,
        type: Team_B_Pic.type || 'image/jpeg',
        name: Team_B_Pic.fileName || `team_b_${Date.now()}.jpg`,
      });

      // =========================
      // API
      // =========================

      const response = await API.post('/matches/match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('MATCH RESPONSE:', response.data);

      Alert.alert('Success', 'Match Saved Successfully');

      // =========================
      // RESET FORM
      // =========================

      setTeamA('');
      setTeamB('');
      setVenue('');
      setStartTime('');

      setTeamAPic(null);
      setTeamBPic(null);

      setDate(new Date());
      setPickerMode('date');
      setShowPicker(false);
    } catch (error) {
      console.log('Match Error:', error.response?.data || error.message);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Match Save Failed',
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Match</Text>

      {/* ================= TEAM A ================= */}

      <Text style={styles.label}>Team A *</Text>

      <TextInput
        placeholder="Enter Team A"
        value={Team_A}
        onChangeText={setTeamA}
        style={styles.input}
      />

      <TouchableOpacity style={styles.imageButton} onPress={selectTeamAPic}>
        <Text style={styles.imageButtonText}>
          {Team_A_Pic ? 'Change Team A Picture' : 'Select Team A Picture *'}
        </Text>
      </TouchableOpacity>

      {Team_A_Pic ? (
        <Image source={{ uri: Team_A_Pic.uri }} style={styles.preview} />
      ) : (
        <Text style={styles.requiredText}>Team A picture is required</Text>
      )}

      {/* ================= TEAM B ================= */}

      <Text style={styles.label}>Team B *</Text>

      <TextInput
        placeholder="Enter Team B"
        value={Team_B}
        onChangeText={setTeamB}
        style={styles.input}
      />

      <TouchableOpacity style={styles.imageButton} onPress={selectTeamBPic}>
        <Text style={styles.imageButtonText}>
          {Team_B_Pic ? 'Change Team B Picture' : 'Select Team B Picture *'}
        </Text>
      </TouchableOpacity>

      {Team_B_Pic ? (
        <Image source={{ uri: Team_B_Pic.uri }} style={styles.preview} />
      ) : (
        <Text style={styles.requiredText}>Team B picture is required</Text>
      )}

      {/* ================= VENUE ================= */}

      <Text style={styles.label}>Venue *</Text>

      <TextInput
        placeholder="Enter Venue"
        value={Venue}
        onChangeText={setVenue}
        style={styles.input}
      />

      {/* ================= DATE / TIME ================= */}

      <Text style={styles.label}>Start Date & Time *</Text>

      <TouchableOpacity
        onPress={() => {
          setPickerMode('date');
          setShowPicker(true);
        }}
      >
        <Text style={styles.dateInput}>
          {Start_Time ? date.toLocaleString() : 'Select Date & Time *'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);

            if (event.type === 'dismissed') {
              return;
            }

            if (selectedDate) {
              if (pickerMode === 'date') {
                setDate(selectedDate);

                setTimeout(() => {
                  setPickerMode('time');
                  setShowPicker(true);
                }, 100);
              } else {
                const finalDate = new Date(date);

                finalDate.setHours(selectedDate.getHours());

                finalDate.setMinutes(selectedDate.getMinutes());

                finalDate.setSeconds(0);

                setDate(finalDate);

                setStartTime(finalDate.toISOString());
              }
            }
          }}
        />
      )}

      {/* ================= SAVE ================= */}

      <View style={styles.saveButton}>
        <Button title="Save Match" onPress={saveMatch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    color: '#333',
    fontSize: 16,
  },

  imageButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },

  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  preview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: 'cover',
  },

  requiredText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 12,
  },

  saveButton: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default Match;
