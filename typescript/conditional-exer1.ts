// https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/
namespace ConditionalExample {
    type Action =
        | { type: "INIT" }
        | { type: "LOG_IN", emailAddress: string }

    // declare function dispatch(action: Action): void;

    type ActionType = Action["type"]

    declare function dispatch(type: SimpleActionType): void;
    declare function dispatch<T extends ActionType>(
      type: T,
      args: ExtractActionParameters<Action, T>
    ): void;

    type ExtractActionParameters<A, T> = A extends { type: T } ?
      EmptyToNever<ExcludeTypeField<A>> : never

    type ExcludeTypeField<A> = {
      [K in Exclude<keyof A, "type">]: A[K]
    }

    type R1 = ExcludeTypeField<{ type: "INIT" }>
    type R2 = ExcludeTypeField<{ type: "LOG_IN", emailAddress: string }>

    type EmptyToNever<T> = keyof T extends never ? never : T
    type R3 = EmptyToNever<{}>
    type R4 = EmptyToNever<{ a: string }>

    // type Test = ExcludeTypeField<{ type: "LOG_IN", emailAddress: string }, "type">
    type Test = ExtractActionParameters<Action, "LOG_IN">
    type Test1 = ExtractActionParameters<Action, "INIT">

    type SimpleActionType = ExtractSimpleAction<Action>["type"]

    // type ExtractSimpleAction<A> = {} extends ExcludeTypeField<A> ? A : never
    type ExtractSimpleAction<A> = A extends any
      ? {} extends ExcludeTypeField<A> ? A : never
      : never

    dispatch("INIT")
    // error
    dispatch("INIT", {})
    // error
    dispatch("LOG_IN", {})
    dispatch("LOG_IN", { emailAddress: '' })
}
