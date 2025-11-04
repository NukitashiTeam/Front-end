import { Animated, StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'

const { width, height} = Dimensions.get("window");

const Paginator = ({data, scrollX, index}: {data: any[], scrollX: Animated.Value, index: number}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: height*0.15}}>
       {data.map((_, i) => {

          const dotStyle = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          })

          return (
            <Animated.View key={i.toString()} style={[styles.dot, {transform: [{scale: dotStyle}], backgroundColor: i === index ? '#818BFF' : '#FFF',}]}>
              <Text style={styles.num}>{i + 1}</Text>
            </Animated.View>
          )
        })

       }
    </View>
  )
}

export default Paginator

const styles = StyleSheet.create({
    dot: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: 50,
        backgroundColor: '#FFF',
        marginHorizontal: 8,
    },
    num: {
        fontSize: 10,
        color: '#818BFF',  
    }
})