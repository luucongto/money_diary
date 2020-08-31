import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content, View, Fab, Icon } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import CategoryComponent from '../Components/MoneyDairy/CategoryComponent'
import CategoryRedux from '../Redux/CategoryRedux'
import { Category } from '../Realm'
import autoBind from 'react-autobind'
import AddCategoryModal from '../Components/MoneyDairy/AddCategoryModal'
class Screen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {},
      categories: []
    }
    autoBind(this)
  }

  componentDidMount () {
    this.refresh()
  }

  componentWillReceiveProps (nextProps) {
    const prevProps = this.props
    if (prevProps.categoryObjects !== nextProps.categoryObjects) {
      this.refresh()
    }
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
    const renderItems = this.state.categories.map(item => {
      return (
        <CategoryComponent key={item.id} item={item} onPress={(item) => this.openDetailScreen(item)} />
      )
    })
    return (
      <Container>
        <Content>
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
    categoryObjects: state.category.objects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    categoryCreateRequest: (params) => dispatch(CategoryRedux.categoryCreateRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
