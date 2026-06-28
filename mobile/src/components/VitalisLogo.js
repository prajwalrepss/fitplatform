import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function VitalisLogo({ size = 48, style }) {
  return (
    <Image
      source={require('../../assets/vitalis-logo.png')}
      style={[
        styles.logo,
        { width: size, height: size, borderRadius: size * 0.22 },
        style,
      ]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: '#081220',
  },
});
