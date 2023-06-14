// Libraries
import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Actions
import {
    useCommentQuizMutation,
    useCreateQuizMutation,
    useDeleteQuizMutation,
    useLikeQuizMutation,
    useUpdateQuizMutation,
} from 'src/services/quizApi';
import { createQuiz } from 'src/slices/quizSlice';

// Components, colors, constants
import {
    Header,
    DurationTabs,
    Weekly,
    AllTime,
} from 'src/components/leaderboard';
import { colors } from 'src/styles/color';
import { userLeaderboard } from 'src/constants/userLeaderboard.constant';
import { API } from 'src/constants/api';

// 2 button Tab thời gian
const durationTabs = ['Weekly', 'All Time'];

export default function LeaderBoard({ navigation }) {
    const [formQuiz, { data, isLoading, error }] = useCreateQuizMutation();
    const dispatch = useDispatch();
    const [leaderBoard, setLeader] = useState([]);

    const userData = useSelector((state) => state.auths?.authData);
    const userId = userData?.data?.user?._id;
    const accessToken = userData?.data?.accessToken;

    const users = useSelector((state) => state.users.users);

    useEffect(() => {
        if (users) {
            let leader = [...users];
            leader.sort(function (a, b) {
                return b.point - a.point;
            });
            setLeader(leader);
        }
    }, [users]);

    //
    // NhatDev IS HERE

    // Value refreshing sẽ đi với prop RefreshControl của ScrollView
    // phía dưới để khi đang ở vị trí trên cùng của ScrollView
    // mà mình kéo xuống thì sẽ load lại Api mới nhất (có thể xài hoặc bỏ đi)
    const [refreshing, setRefreshing] = useState(false);

    const [activeTab, setActiveTab] = useState(durationTabs[0]);

    const displayTabContent = () => {
        switch (activeTab) {
            case 'Weekly':
                return <Weekly leaderBoard={leaderBoard} />;
            case 'All Time':
                return <AllTime leaderBoard={leaderBoard} />;
            default:
                break;
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetch(`${API}api/users`, {
            method: 'GET',
            headers: new Headers({
                Authorization: `Bearer ${accessToken}`,
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json',
            }),
        })
            .then((data) => data.json())
            .then((json) => {
                json.sort(function (a, b) {
                    return b.point - a.point;
                });
                setLeader(json);
                setRefreshing(false);
            })
            .catch((error) => console(error));
    }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         if (!isFocus) {
    //             fetch(`${API}api/users`, {
    //                 method: 'GET',
    //                 headers: new Headers({
    //                     Authorization: `Bearer ${accessToken}`,
    //                     'user-agent': 'Mozilla/4.0 MDN Example',
    //                     'content-type': 'application/json',
    //                 }),
    //             })
    //                 .then((data) => data.json())
    //                 .then((json) => {
    //                     dispatch(fetchAllUsers(json));
    //                     json.sort(function (a, b) {
    //                         return b.point - a.point;
    //                     });
    //                     setLeader(json);
    //                 })
    //                 .catch((error) => console(error));
    //         }
    //     }, [isFocus]),
    // );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.primary,
            }}
        >
            <View
                style={{
                    flex: 1,
                    paddingTop: 16,
                    paddingHorizontal: 10,
                }}
            >
                <Header
                    title="Leaderboard"
                    navigation={navigation}
                    direct="Home"
                />

                <DurationTabs
                    durationTabs={durationTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 10,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {displayTabContent()}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
