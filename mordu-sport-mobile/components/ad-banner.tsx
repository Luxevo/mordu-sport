import { View, Image, StyleSheet } from "react-native"

export function AdBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../public/ads/rocdisplaybanner.jpg')} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  image: {
    width: 320,
    height: 100,
  },
})