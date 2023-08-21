import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'; // Import your main screen component
import StoryDetailsScreen from './components/StoryDetailsScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="StoryDetails" component={StoryDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
