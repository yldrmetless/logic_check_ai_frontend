import { baseApi } from "./baseApi";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_time: number;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginFormValues>({
            query: (credentials) => ({
                url: "/users/login/",
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation<RegisterResponse, RegisterFormValues>({
            query: (data) => ({
                url: "/users/register/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
