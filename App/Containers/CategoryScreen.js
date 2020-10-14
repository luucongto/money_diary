// import { Images, Metrics } from '../Themes'
import { Container, Content, Fab, Icon, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { RefreshControl } from 'react-native'
import AddCategoryModal from '../Components/MoneyDairy/AddCategoryModal'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import CategoryComponent from '../Components/MoneyDairy/CategoryComponent'
import ScreenHeader from '../Components/MoneyDairy/ScreenHeader'
import { Category } from '../Realm'
import CategoryRedux from '../Redux/CategoryRedux'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'
class CategoryScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {},
      categories: Category.findWithAmount()
    }
    autoBind(this)
  }

  componentDidMount () {
    this.refresh()
  }

  refresh () {
    const categories = Category.findWithAmount()
    this.setState({ categories })
  }

  openDetailScreen (item) {
    this.props.navigation.navigate('TransactionScreen', { category: item, useWalletTitle: true })
  }

  itemCreate (params) {
    this.props.categoryCreateRequest(params)
  }

  renderPhone () {
    Utils.log('render CategoryScreen', this.state.categories)
    const renderItems = this.state.categories.map(item => {
      return (
        <CategoryComponent key={item.id} item={item} onPress={(item) => this.openDetailScreen(item)} />
      )
    })
    return (
      <Container>
        <ScreenHeader navigation={this.props.navigation} title='Categories' />
        <Content
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
        >
          {renderItems}
          <View style={{ height: 50 }} />
        </Content>

        <AddCategoryModal
          setRef={(ref) => { this.addModalRef = ref }}
          itemCreate={this.itemCreate.bind(this)}
        />

        <Fab
          active={this.state.active}
          direction='up'
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => this.addModalRef.setModalVisible(true)}
        >
          <Icon name='pricetag-outline' type='Ionicons' />
        </Fab>
      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    categoryCreateRequest: (params) => dispatch(CategoryRedux.categoryCreateRequest(params))
  }
}
const screenHook = Screen(CategoryScreen, mapStateToProps, mapDispatchToProps, ['category'])
export default screenHook
