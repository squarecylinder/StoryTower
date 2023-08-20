import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'; // Import your main screen component

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
