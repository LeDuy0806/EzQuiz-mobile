import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from 'src/constants/api';

export const apiUser = createApi({
    reducerPath: 'apiUser',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://server-auth-quocanh.onrender.com/',
        baseUrl: API,
    }),
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: (accessToken) => ({
                url: 'api/users/findfriend',
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
        getUser: builder.query({
            query: ({ accessToken, userId }) => ({
                url: `api/users/${userId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),

        updateUser: builder.mutation({
            query: ({ accessToken, userId, updateUser }) => ({
                url: `api/users/${userId}`,
                method: 'PATCH',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: updateUser,
            }),
        }),

        addFriend: builder.mutation({
            query: ({ accessToken, myId, friendId }) => ({
                url: `api/users/${myId}/addfriend/${friendId}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),

        follow: builder.mutation({
            query: ({ accessToken, myId, friendId }) => ({
                url: `api/users/${myId}/follow/${friendId}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),

        unFollow: builder.mutation({
            query: ({ accessToken, myId, friendId }) => ({
                url: `api/users/${myId}/unfollow/${friendId}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useAddFriendMutation,
    useFollowMutation,
    useUnFollowMutation,
} = apiUser;
