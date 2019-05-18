/**
 * create action factory
 *
 * @param type the identifier of actions, defaults to a unique symbol
 * @returns an action factory with type predicate
 */
export const ActionCreator = <T = void>(type: any = Symbol()) =>
  Object.assign(
    /**
     * action factory (creator)
     * 
     * @param payload the payload of the created action
     */
    (payload: T) => ({
      /** the type of action, NEVER TO READ IT */
      type,
      /** the payload of the action */
      payload,
    }),
    {
      /**
       * Returns true if `a` is an action created by this action factory.
       * 
       * @param a anything treated as an action
       */
      match: (a: any): a is { payload: T } => a && a.type === type,
    },
  );
