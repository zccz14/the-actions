export interface IAction<T = void> {
  /** unknown type */
  type: unknown;
  /** the payload of the action */
  payload: T;
}

export interface IActionCreator<T = void> {
  /**
   * action creator
   *
   * @param payload the payload of the created action
   */
  (payload: T): IAction<T>;
  /**
   * Returns true if `a` is an action created by this action creator.
   *
   * @param a anything treated as an action
   */
  match: (a: any) => a is IAction<T>;
}

/**
 * create an Action Creator
 *
 * @param type the identifier of actions, defaults to a unique symbol
 * @template T the type of action payload
 * @returns an action creator with type predicate
 */
export const ActionCreator = <T = void>(type: any = Symbol()) =>
  Object.assign((payload: T) => ({ type, payload }), {
    match: (a: any) => a && a.type === type,
  }) as IActionCreator<T>;
