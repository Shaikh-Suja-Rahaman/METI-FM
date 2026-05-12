import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  // Adding a dummy reducer to silense the "Store does not have a valid reducer" error
  reducer: {
    app: (state = {}) => state
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
