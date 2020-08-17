import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    width: 100,
    height: 30,
    margin: 7
  },
  sourceLogo: {
    width: 100,
    height: 30,
    backgroundColor: '#F4F5F6',
    borderRadius: 5
  },
  selected: {
    backgroundColor: 'red'
  },
  // sourceImage: {
  //   width: 100,
  //   height: 30,
  //   resizeMode: 'stretch'
  // },
  sourceTitle: {
    fontFamily: 'Arial',
    textAlign: 'center',
    width: '100%',
    fontSize: 12,
    lineHeight: 20
  }
})
