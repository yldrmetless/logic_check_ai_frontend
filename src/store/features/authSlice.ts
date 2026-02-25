import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "../api/authApi";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    expirationTimestamp: number | null;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    expirationTimestamp: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<LoginResponse>) => {
            const { access_token, refresh_token, expires_time } = action.payload;
            const expirationTimestamp = Date.now() + expires_time * 60 * 1000;

            state.accessToken = access_token;
            state.refreshToken = refresh_token;
            state.expirationTimestamp = expirationTimestamp;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("expirationTimestamp", expirationTimestamp.toString());
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.expirationTimestamp = null;

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("expirationTimestamp");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
