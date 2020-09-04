import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import Utils from '../Utils/Utils'

function Screen (RenderComponent, mapStateToProps, mapDispatchToProps, selectors) {
  const gene = (props) => {
    const initialState = {
      isFocused: false
    }
    const [state, setState] = useState(initialState)
    useFocusEffect(
      React.useCallback(() => {
        setState({ isFocused: true })

        return () =>
        // componentWillUnmount
          setState({ isFocused: false })
      }, [])
    )
    // convert from mapDispatchToProps
    const dispatch = useDispatch()
    const requests = mapDispatchToProps(dispatch)
    // convert from mapStateToProps
    const reduxSelector = {}
    selectors.forEach(selector => {
      reduxSelector[selector] = useSelector(state => state[selector])
    })
    const stateToProps = mapStateToProps(reduxSelector)

    const newProps = { ...props, ...state, ...requests, ...stateToProps }
    Utils.log('render ', RenderComponent.name)
    return <RenderComponent {...newProps} />
  }
  return gene
}

export default Screen
