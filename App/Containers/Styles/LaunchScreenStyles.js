import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'
const p = Metrics.consts
const t = Metrics.tabs

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin,
    backgroundColor: 'red'
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  launchBg: {
    width: '100%',
    height: '100%'
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: p._102,
    width: p._264,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: p._80,
    resizeMode: 'contain'
  },

  tab_logo: {
    height: t._172,
    width: t._444,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: t._248,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  btn_login: { width: p._281, marginBottom: p._10, height: p._41, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00BBDA' },
  tab_btn_login: { width: t._471, height: t._69, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00BBDA', marginTop: t._50 },
  tab_txt: { width: '100%', marginBottom: t._30, marginTop: t._50, textAlign: 'center' }
})
