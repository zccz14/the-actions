# the-actions

Refine the actions in TypeScript context.

`the-actions` is good for:

- Gain **type-safe** without extra pain, which includes:
  - Uniting actions together for narrowing the type later in 'reducer' or anywhere
  - Enforcing the `type` to be string literal.
- **Simple** to understand, **easy** to use
  - No magic. `createActionFactory` could be implemented in 4 lines of pretty-printed code.
  - ActionCreator-like API, easy to create an action.
- **Reduce boilerplate code** without losing the one-to-one assumption
  - Unlike some redux utilities, `the-actions` doesn't change the way to create a 'reducer'.
- Use `type` no more than **ONCE**
  - What's the point of using the `type` anywhere? No point at all!
  - Once specified, never to use anymore.
  - Or there could be a babel-plugin to generate `type`.
- Non-invasively introducing
  - `the-actions` doesn't reject to work with other-system actions if they do too.
- More general usage
  - `the-actions` can be integrated into redux (reducer), redux-saga (take\*), react hooks (useReducer), and anything need to mark a type for channeling, which exceeds the react & redux ecosystem.

## Usage

```ts
// create an action factory
import { createActionFactory } from "the-actions";
const sampleActionFactory = createActionFactory<{ text: string }>();

// create an action
const sampleAction = sampleActionFactory({ text: "hello, world" });

// usage in redux reducer
const initState = { text: "" };
const reducer = (state = initState, action: unknown) => {
  if (sampleActionFactory.match(action)) {
    return { ...state, text: action.payload.text };
  }
  return state;
};

// usage in react-redux connect
import { bindActionCreators, Dispatch } from "redux";
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      sampleActionFactory,
    },
    dispatch,
  );

// usage in redux-saga
import { call, takeLatest } from "redux-saga/effects";
function* saga() {
  yield takeLatest(sampleActionFactory.match, sampleListener);
}
function* sampleListener(action: ReturnType<typeof sampleActionFactory>) {
  yield call(console.log, action.payload.text);
}

// usage in react useReducer hook
import React, { useReducer } from "react";
const InputComponent = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <input
      value={state.text}
      onChange={(e: React.ChangeEvent<HtmlInputElement>) => {
        dispatch(sampleActionFactory(e.target.value));
      }}
    />
  );
};
```
