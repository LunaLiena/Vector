export type InferComponentProps<C> = C extends React.ComponentType<infer P> ? P : never
