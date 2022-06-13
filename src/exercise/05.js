// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import {Switch} from '../switch'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case toggleReducerActions.toggle: {
      return {on: !state.on}
    }
    case toggleReducerActions.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

const toggleReducerActions = {
  toggle: 'toggle',
  reset: 'reset',
}

function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: toggleReducerActions.toggle})
  const reset = () => dispatch({type: toggleReducerActions.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

// export { useToggle, toggleReducer, toggleReducerActions}

// import { useToggle, toggleReducer, toggleReducerActions}

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  const clickedTooMuch = timesClicked >= 4

  function toggleStateReducer(state, action) {
    if (action.type === toggleReducerActions.toggle && timesClicked >= 4) {
      return {on: state.on}
    }
    return toggleReducer(state, action)
  }

  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
