// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./features/api/baseApi"; // file baseApi mà bạn đã viết

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// types để dùng với useDispatch / useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
