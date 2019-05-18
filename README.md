# the-actions

Refine the actions in TypeScript context.

- Gain **type-safe** without extra pain, which includes:
  - Uniting actions together for narrowing the type later in 'reducer' or anywhere
  - Enforcing the `type` to be string literal.
- **Simple** to understand, **easy** to use
  - No magic. `ActionCreator` could be implemented in 4 lines of pretty-printed code.
  - ActionCreator-like API, easy to create an action.
  - FSA is no longer important in TypeScript context.
    - Firstly, `meta` and `error` have rarely usecases.
    - And, TypeScript makes you trust that the `payload` is type-safe without checking `error`.
    - It's better to **nest actions** rather than to mark `meta` and `error` besides `payload`.
- **Reduce boilerplate code** without [the one-to-one mapping assumption](https://redux.js.org/faq/actions#is-there-always-a-one-to-one-mapping-between-reducers-and-actions)
  - Unlike some redux utilities, `the-actions` doesn't change the way to create a 'reducer'.
- Use `type` no more than **ONCE**
  - What's the point of using the `type` anywhere? No point at all!
  - Once specified, never to use anymore.
  - Or there could be a babel-plugin to generate `type`.
- Non-invasive introducing
  - `the-actions` doesn't reject to work with other-system actions if they do too.
- More general usage
  - `the-actions` can be integrated into redux (reducer), redux-saga (take\*), react hooks (useReducer), and anything need to mark a type for channeling, which exceeds the react & redux ecosystem.

## Usage

```ts
// create an action creator
import { ActionCreator } from "./index";
const setText = ActionCreator<{ text: string }>();

// create an action
const setTextAction = setText({ text: "hello, world" });

// usage in redux reducer
const initState = { text: "" };
const reducer = (state = initState, action: unknown) => {
  if (setText.match(action)) {
    return { ...state, text: action.payload.text };
  }
  return state;
};

// usage in react-redux connect
import { bindActionCreators, Dispatch } from "redux";
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setText,
    },
    dispatch,
  );

// usage in redux-saga
import { call, takeLatest } from "redux-saga/effects";
function* saga() {
  yield takeLatest(setText.match, sampleListener);
}
function* sampleListener(action: ReturnType<typeof setText>) {
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
        dispatch(setText(e.target.value));
      }}
    />
  );
};
```

## Compare with other action utilities

Yes, there's many action utilities published. And some of them are designed for typescript.
up to now, there're many in npm, includes `typesafe-actions`, `typescript-fsa`, `ts-action`, `typed-redux-actions`, `create-action-ts`, `redux-action-class`...

Take the most typical for examples,

### `typescript-fsa`

It's almost what I want!

The core mechanisms are the same except `the-actions` is not fully FSA-compliant. In fact, `the-actions` loaded `meta` and `error` off to be simple.

By the way, it's a amazing coincidence that `typescript-fsa` and `the-actions` takes the same word "match" to name the type predicate.

Another difference is that `the-actions` doesn't treat the "Async Action Creators" as first-class concept. In `the-actions`, "Async Action Creators" is a sample of "Action Creator Group", which is a composition of action creators.

Further more, when creating an action creator in `typescript-fsa`, you MUST pass a `type` for identify the action creator. It's no problem but lose the chance to entirely avoid specifying a unique string.

### `typesafe-actions`

The core mchanisms to be type-safe are really different. 

The way of `typesafe-actions` is troublesome. 

1. `type` MUST BE string literal (Ability Limited)
  
    It stopped writing prefix (namespace) for the action type.

2. Actions SHOULD BE united first (Boilerplate Code)

    That is, you, the app developper, should define the universal set of action for every reducer. And then, typescript helps narrowing the scope from the universal set.

So, `typesafe-actions` paid too much for type-safe.
