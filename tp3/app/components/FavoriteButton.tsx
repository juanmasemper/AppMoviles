import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onPress,
  size = 28
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    // Animación al presionar
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Ionicons 
          name={isFavorite ? 'heart' : 'heart-outline'} 
          size={size} 
          color={isFavorite ? '#ff4444' : '#333'} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});

export default FavoriteButton;