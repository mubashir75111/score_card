import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './src/screens/Home';
import Match from './src/screens/Match';
import MatchUpdate from './src/screens/MatchUpdate';
import AddPlayers from './src/screens/AddPlayers';
import StartMatch from './src/screens/StartMatch';
import Dashboard from './src/screens/Dashboard';
import MatchDetails from './src/screens/MatchDetails';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Match" component={Match} />
          <Stack.Screen name="MatchUpdate" component={MatchUpdate} />
          <Stack.Screen name="AddPlayers" component={AddPlayers} />
          <Stack.Screen name="StartMatch" component={StartMatch} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="MatchDetails" component={MatchDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
