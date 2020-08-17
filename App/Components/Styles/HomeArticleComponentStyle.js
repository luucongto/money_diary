import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    width: '100%',
    height: 100,
    padding: 15,
    alignItems: 'center'
  },
  text_container: {
    flex: 3,
    flexDirection: 'column',
    alignSelf: 'stretch',
    height: '100%'
  },
  title: {
    fontSize: 16,
    alignItems: 'center',
    color: '#000000',
    width: '100%',
    lineHeight: 20,
    height: 46,
    marginRight: 15
  },
  thumbnail: {
    flex: 1,
    backgroundColor: 'gray',
    borderRadius: 5,
    width: '28.8%',
    height: 72,
    marginLeft: 'auto'
  }
})
