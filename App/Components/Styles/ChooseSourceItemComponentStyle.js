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
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  selected: {
    backgroundColor: '#333333'
  },
  sourceImage: {
    width: 100,
    height: 30,
    resizeMode: 'stretch'
  },
  sourceTitle: {
    fontFamily: 'Arial',
    textAlign: 'center',
    height: '100%',
    width: '100%',
    paddingTop: 4,
    fontSize: 12
  },
  title_selected: {
    color: 'white'
  }
})
