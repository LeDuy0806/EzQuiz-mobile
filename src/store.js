// Library
import {
    configureStore,
    createImmutableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

//api
import { apiAuth } from './services/authApi';
import { apiQuiz } from './services/quizApi';
import { apiUser } from './services/userApi';
import { apiGame } from './services/gameApi';
import { apiLeaderboard } from './services/leaderboardApi';
import { apiPlayerResult } from './services/playerResultApi';

// Slices
import authReducer from './slices/authSlice';
// import creatorReducer from './slices/creatorSlice';
import searchReducer from './slices/searchSlice.js';
import quizReducer from './slices/quizSlice';
import userReducer from './slices/usersSlice';
import socketReducer from './slices/socketSlice';
import gameReducer from './slices/gamesSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import playeResultReducer from './slices/playerResultSlice';
import { users } from './constants/user.constant';

const immutableInvariantMiddleware = createImmutableStateInvariantMiddleware({
    ignoredPaths: ['ignoredPath', 'ignoredNested.one', 'ignoredNested.two'],
});

const store = configureStore({
    reducer: {
        [apiAuth.reducerPath]: apiAuth.reducer,
        [apiQuiz.reducerPath]: apiQuiz.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
        [apiGame.reducerPath]: apiGame.reducer,
        [apiLeaderboard.reducerPath]: apiLeaderboard.reducer,
        [apiPlayerResult.reducerPath]: apiPlayerResult.reducer,

        auths: authReducer,
        quizs: quizReducer,
        users: userReducer,
        sockets: socketReducer,
        games: gameReducer,
        searchs: searchReducer,
        leaderboards: leaderboardReducer,
        playeResults: playeResultReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: {
                ignoredPaths: [
                    'ignoredPath',
                    'ignoredNested.one',
                    'ignoredNested.two',
                    'items.data',
                ],
            },
        }).concat([
            apiAuth.middleware,
            apiQuiz.middleware,
            apiUser.middleware,
            apiGame.middleware,
            apiLeaderboard.middleware,
            apiPlayerResult.middleware,
        ]),
});

setupListeners(store.dispatch);

export default store;
