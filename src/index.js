import Enum from 'es6-enum'
import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import classNames from 'classnames'
import Immutable from 'immutable'

import thunk from 'redux-thunk'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {Provider, connect} from 'react-redux'

// simple utilities

const resolveData = async dataOrPromiseOrFunction => {
  const dataOrPromise = typeof dataOrPromiseOrFunction === 'function' ? dataOrPromiseOrFunction() : dataOrPromiseOrFunction
  return dataOrPromise && dataOrPromise.then ? await dataOrPromise : dataOrPromise
}

const rolesToMapUpdate = (rolesItem, value) => {
  if (Array.isArray(rolesItem)) {
    return rolesItem.reduce((result, item) => (result[item] = value, result), {})
  } else if (typeof rolesItem === 'string' || Object.prototype.toString(rolesItem) === '[object String]') {
    return {[rolesItem]: value}
  } else {
    return {}
  }
}

const resolveRoles = (rolesItem, value) => resolveData(rolesItem).then(rolesItem -> rolesToMapUpdate(rolesItem, value))

const ACTIONS = Enum(
  'MERGE_ROLES',
  'CLEAR_ROLES',
)

const ConfigContext = React.createContext()

const defaultState = Immutable.Map({
  roles: Immutable.Set(),
})

function reducer(state = defaultState, action) {
  switch (action.type) {
    case ACTIONS.MERGE_ROLES:
      return state.set('roles', state.get('roles').withMutations(roles => {
        Object.entries(action.roles).forEach(([key, value]) => {
          if (value) {
            roles.remove(key)
          } else {
            roles.add(key)
          }
        })
      }))
    case ACTIONS.CLEAR_ROLES:
      return state.set('roles', Immutable.Set())
  }
  return state
}

const configStore = createStore(
  reducer,
  compose(applyMiddleware(thunk)),
)

const configConnect = options => Component => {
  const {mapStateToProps, mapDispatchToProps} = options
  const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps, null, {context: ConfigContext})(Component)
  return props => <Provider context={ConfigContext} store={configStore}><ConnectedComponent {...props}/></Provider>
}

const addRoles = roles => dispatch => resolveRoles(roles, true).then(roles => dispatch({type: ACTIONS.MERGE_ROLES, roles})
const removeRoles = roles => dispatch => resolveRoles(roles, false).then(roles => dispatch({type: ACTIONS.MERGE_ROLES, roles})
const mergeRoles = roles => dispatch => resolveData(roles).then(roles => dispatch({type: ACTIONS.MERGE_ROLES, roles})
const clearRoles = dispatch => dispatch({type: ACTIONS.CLEAR_ROLES})

export const configPick = (...picked) => {
  function mapDispatchToProps(dispatch) {
    const result = {}
    for (const pick of picked) {
      switch (pick) {
        case 'add':
          result.addRoles = addRoles
          break
        case 'remove':
          result.removeRoles = removeRoles
          break
        case 'merge':
          result.mergeRoles = mergeRoles
          break
        case 'clear':
          result.clearRoles = clearRoles
          break
      }
      Object.entries(([key, value) => result[key] = (...args) => dispatch(value(...args))
    }
    return result
  }

  function mapStateToProps(store, props) {
    const result = {}
    for (const pick of picked) {
      switch (pick) {
      }
    }
    return result
  }
  return configConnect({mapStateToProps, mapDispatchToProps})
}
