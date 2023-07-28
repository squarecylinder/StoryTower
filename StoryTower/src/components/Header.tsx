import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = () => {
  const handleMenuPress = () => {
    console.log('Menu button pressed');
  };

  return (
    <View style={styles.container}>
      {/* SVG Logo */}
      <View style={styles.logoContainer}>
        <Svg width={32} height={48} viewBox="0 0 24 36">
          {/* Tower Top */}
          <Path
            d="M5,3 L6,1 L14,1 L15,3 L10,0 L5,3 Z"
            stroke="#000"
            strokeWidth="1.5"
            fill="#000"
          />

          {/* Tower Body */}
          <Path
            d="M6,3 L6,20 L14,20 L14,3 L6,3 Z"
            stroke="#000"
            strokeWidth="1.5"
            fill="#000"
          />

          {/* Tower Base */}
          <Path d="M5,20 L15,20 L15,24 L5,24 L5,20 Z" stroke="#000" strokeWidth="1.5" fill="#000" />
        </Svg>
        <Text style={styles.logoText}>{"\n"}StoryTower</Text>
      </View>

      {/* Menu Icon */}
      <TouchableOpacity style={styles.menuIconContainer} onPress={handleMenuPress}>
        <Icon name="menu" size={24} color="black" />
      </TouchableOpacity>
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
