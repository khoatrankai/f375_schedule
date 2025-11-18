import { configureStore } from "@reduxjs/toolkit";

import userInfoSlice from "./slices/userSlices/get_users.slice";

import statusMenu from "./slices/menu.slice";
import imagePreview from "./slices/image-preview.slice";


export const store = configureStore({
  reducer: {
   
    get_users: userInfoSlice,
    
    status_tab_menu: statusMenu,
    image_preview: imagePreview,

  },
});

// Tạo các type cho RootState và AppDispatch để sử dụng TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
