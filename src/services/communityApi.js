import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from 'src/constants/api';

export const apiCommunity = createApi({
    reducerPath: 'apiCommunity',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://server-auth-quocanh.onrender.com/',
        baseUrl: API,
    }),
    endpoints: (builder) => ({
        getCommunity: builder.query({
            query: ({ accessToken, id }) => ({
                url: `api/community/${id}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
        getCommunities: builder.query({
            query: (accessToken) => ({
                url: 'api/community',
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
        createCommunity: builder.mutation({
            query: ({ accessToken, formData }) => ({
                url: 'api/community',
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            }),
        }),
        deleteCommunity: builder.mutation({
            query: ({ accessToken, id }) => ({
                url: `api/community/${id}`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
        addQuizCommunity: builder.mutation({
            query: ({ accessToken, id, quizId }) => ({
                url: `api/community/${id}/quiz/${quizId}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
        deleteQuizCommunity: builder.mutation({
            query: ({ accessToken, id, quizId }) => ({
                url: `api/community/${id}/deletequiz/${quizId}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        }),
        addMessageBox: builder.mutation({
            query: ({ accessToken, id, message }) => ({
                url: `api/community/addmessage/${id}`,
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: { message },
            }),
        }),
    }),
});

export const {
    useGetCommunityQuery,
    useGetCommunitiesQuery,
    useCreateCommunityMutation,
    useDeleteCommunityMutation,
    useAddQuizCommunityMutation,
    useDeleteQuizCommunityMutation,
    useAddMessageBoxMutation,
} = apiCommunity;
