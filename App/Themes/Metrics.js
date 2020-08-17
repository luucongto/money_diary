import { Dimensions, Platform } from 'react-native'
// import { Metrics } from '.'

const { width, height } = Dimensions.get('window')
const aspectRatio = height > width ? height / width : width / height
// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  isPhone: aspectRatio > 1.6,
  aspectRatio: aspectRatio,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
}

const DESIGN_HEIGHT = 414
const DESIGN_HEIGHT_TAB = 768
function baseOnHeight (input) {
  return metrics.screenWidth * input / DESIGN_HEIGHT
}

function baseOnHeightTab (input) {
  return metrics.screenWidth * input / DESIGN_HEIGHT_TAB
}

metrics.baseOnHeight = baseOnHeight
metrics.baseOnHeightTab = baseOnHeightTab
metrics.consts = {
}
metrics.tabs = {

}
for (var i = 1; i < 1000; i++) {
  metrics.consts[`_${i}`] = baseOnHeight(i)
  metrics.tabs[`_${i}`] = baseOnHeightTab(i)
}

export default metrics
