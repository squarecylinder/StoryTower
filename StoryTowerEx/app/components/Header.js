import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = () => {
  const handleMenuPress = () => {
    console.log('Menu button pressed');
  };

  return (
    <View style={styles.container}>
      {/* SVG Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>{"\n"}StoryTower</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: -8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
    marginTop: -16, // Adjust this value to control the text position
  },
  menuIconContainer: {
    padding: 8,
  },
});

export default Header;
