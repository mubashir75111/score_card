import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { launchImageLibrary } from 'react-native-image-picker';

import { getMatch, addplayer } from '../api/matchApi';

const AddPlayers = ({ route, navigation }) => {
  // Match ID
  const { id } = route.params;

  // React Query cache
  const queryClient = useQueryClient();

  // Form States
  const [Team, setTeam] = useState('');
  const [Player_name, setPlayer_name] = useState('');
  const [Player_Pic, setPlayer_Pic] = useState(null);

  // =========================
  // GET SINGLE MATCH
  // =========================

  const {
    data: match,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatch(id),
  });

  // =========================
  // IMAGE PICKER
  // =========================

  const selectPlayerPicture = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          'Error',
          result.errorMessage || 'Image select nahi ho saki',
        );
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert('Error', 'Picture select nahi hui');
        return;
      }

      setPlayer_Pic(asset);
    } catch (error) {
      console.log('Image Picker Error:', error);

      Alert.alert('Error', 'Image select nahi ho saki');
    }
  };

  // =========================
  // ADD PLAYER MUTATION
  // =========================

  const addPlayerMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append('id', String(id));

      formData.append('Team', Team.trim());

      formData.append('Player_name', Player_name.trim());

      // Picture mandatory hai
      formData.append('Player_Pic', {
        uri: Player_Pic.uri,
        name: Player_Pic.fileName || `player_${Date.now()}.jpg`,
        type: Player_Pic.type || 'image/jpeg',
      });

      return addplayer(formData);
    },

    onSuccess: () => {
      Alert.alert('Success', 'Player Added Successfully');

      // Form clear
      setTeam('');
      setPlayer_name('');
      setPlayer_Pic(null);

      // Players list refresh
      queryClient.invalidateQueries({
        queryKey: ['players', id],
      });
    },

    onError: error => {
      console.log('Add Player Error:', error?.response?.data || error?.message);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Player add nahi ho saka',
      );
    },
  });

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = () => {
    if (!Team.trim()) {
      Alert.alert('Error', 'Please select a team');
      return;
    }

    if (!Player_name.trim()) {
      Alert.alert('Error', 'Please enter player name');
      return;
    }

    // =========================
    // PICTURE MANDATORY
    // =========================

    if (!Player_Pic?.uri) {
      Alert.alert('Error', 'Please select player picture');
      return;
    }

    addPlayerMutation.mutate();
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <View style={styles.center}>
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
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Error loading match</Text>

        <Text style={styles.errorText}>{error?.message || String(error)}</Text>
      </View>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Player</Text>

      {/* Match Information */}

      <Text style={styles.matchText}>
        {match?.Team_A} vs {match?.Team_B}
      </Text>

      {/* Select Team */}

      <Text style={styles.label}>Select Team</Text>

      <View style={styles.teamContainer}>
        <TouchableOpacity
          style={[
            styles.teamButton,
            Team === match?.Team_A && styles.selectedTeam,
          ]}
          onPress={() => setTeam(match?.Team_A || '')}
        >
          <Text style={styles.teamButtonText}>{match?.Team_A}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.teamButton,
            Team === match?.Team_B && styles.selectedTeam,
          ]}
          onPress={() => setTeam(match?.Team_B || '')}
        >
          <Text style={styles.teamButtonText}>{match?.Team_B}</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Team */}

      {Team ? (
        <Text style={styles.selectedText}>Selected Team: {Team}</Text>
      ) : null}

      {/* Player Name */}

      <Text style={styles.label}>Enter Player Name</Text>

      <TextInput
        style={styles.input}
        value={Player_name}
        onChangeText={setPlayer_name}
        placeholder="Enter player name"
      />

      {/* Player Picture */}

      <Text style={styles.label}>Player Picture *</Text>

      <TouchableOpacity
        style={styles.imageButton}
        onPress={selectPlayerPicture}
      >
        <Text style={styles.imageButtonText}>
          {Player_Pic ? 'Change Player Picture' : 'Select Player Picture *'}
        </Text>
      </TouchableOpacity>

      {/* Picture Preview */}

      {Player_Pic?.uri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: Player_Pic.uri }} style={styles.preview} />

          <TouchableOpacity onPress={() => setPlayer_Pic(null)}>
            <Text style={styles.removeText}>Remove Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.requiredText}>Player picture is required</Text>
      )}

      {/* Add Player Button */}

      <TouchableOpacity
        style={[
          styles.button,
          addPlayerMutation.isPending && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={addPlayerMutation.isPending}
      >
        {addPlayerMutation.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Player</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddPlayers;

// =========================
// STYLES
// =========================

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
    marginBottom: 15,
    textAlign: 'center',
  },

  matchText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },

  teamContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  teamButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
  },

  selectedTeam: {
    borderWidth: 2,
    borderColor: '#007bff',
  },

  teamButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  selectedText: {
    marginTop: 10,
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },

  imageButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 6,
    alignItems: 'center',
  },

  imageButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },

  previewContainer: {
    alignItems: 'center',
    marginTop: 15,
  },

  preview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  removeText: {
    marginTop: 8,
    color: 'red',
  },

  requiredText: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },

  button: {
    marginTop: 25,
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },

  buttonDisabled: {
    opacity: 0.6,
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
