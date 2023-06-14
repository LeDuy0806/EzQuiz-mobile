import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useCallback, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    ToastAndroid,
    Platform,
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';

import { BoxQuiz } from 'src/components';
import SubLayout from 'src/layouts/SubLayout';

import { colors } from 'src/styles/color';
import { useGetTeacherQuizzesQuery } from 'src/services/quizApi';
import { useCreateQuizMutation } from 'src/services/quizApi';
import { createSocket } from 'src/slices/socketSlice';
import { io } from 'socket.io-client';

import { useIsFocused } from '@react-navigation/native';

let nameIcontime;
let timeCurrent;

import { fetchTeacherQuizes } from 'src/slices/quizSlice';
// import ToastManager, { Toast } from 'toastify-react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { defaultAvatar } from 'src/assets/images/defaultAvatar.png';

export default function Home({ navigation }) {
    const SOCKET_URL = 'http://192.168.146.18:3001';
    const dispatch = useDispatch();
    const focus = useIsFocused();

    const userData = useSelector((state) => state.auths?.authData);
    const accessToken = userData?.data?.accessToken;
    const teacherId = userData?.data?.user?._id;

    const userInfo = useSelector((state) => state.auths?.user);
    const userName = userInfo?.userName;
    const avatar = userInfo?.avatar;

    useEffect(() => {
        if (userData) {
            const socket = io(SOCKET_URL, {
                transports: ['websocket'],
            });
            dispatch(createSocket(socket));
            socket.connect();
            return () => socket?.disconnect();
        }
    }, [userData, dispatch]);

    const { data, isLoading } = useGetTeacherQuizzesQuery({
        accessToken,
        teacherId,
    });

    useEffect(() => {
        const today = new Date();
        const hour = today.getHours();
        timeCurrent = `GOOD ${
            (hour < 12 && hour > 5 && 'MORNING') ||
            (hour < 17 && hour > 12 && 'AFTERNOON') ||
            'EVENING'
        } `;

        nameIcontime = `${
            (hour < 12 && 'weather-sunny') ||
            (hour < 17 && 'weather-cloud') ||
            'weather-night'
        } `;
        nameIcontime =
            hour < 12 && hour > 5
                ? 'weather-sunny'
                : hour < 17 && hour > 12
                ? 'weather-cloudy'
                : 'weather-night';
    }, [focus]);

    useEffect(() => {
        if (data) {
            dispatch(fetchTeacherQuizes(data));
        }
    }, [data]);

    const quizes = useSelector((state) => state.quizs.quizes);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* <ToastManager /> */}

                <View style={styles.firstSection}>
                    {/* Status User */}

                    <View style={styles.userHeader}>
                        <View
                            style={{
                                justifyContent: 'space-between',
                                paddingVertical: 2,
                            }}
                        >
                            <View style={styles.weather}>
                                <MaterialCommunityIcons
                                    name={nameIcontime}
                                    size={18}
                                    color="#FED7DD"
                                />
                                <Text style={styles.subText}>
                                    {timeCurrent}
                                </Text>
                            </View>
                            <Text
                                style={{ ...styles.textHeader, color: 'white' }}
                            >
                                {userName}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Profile', {
                                    avatar: 'cc',
                                });
                            }}
                        >
                            <Image
                                style={styles.image}
                                source={{
                                    uri: avatar
                                        ? avatar
                                        : 'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-cute.jpg?ssl\u003d1',

                                    // uri: 'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-cute.jpg?ssl\u003d1',
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.recentQuiz}>
                        <View
                            style={{
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text
                                style={{
                                    ...styles.textHeader,
                                    fontSize: 15,
                                    color: '#B76C79',
                                }}
                            >
                                Have Good Day
                            </Text>
                            <Text style={styles.textTiltle}>
                                Let's Start to Relax
                            </Text>
                        </View>
                    </View>

                    {/* Status Find Friends */}
                    <View style={styles.boxFindFriend}>
                        <Text
                            style={{
                                ...styles.textHeader,
                                fontSize: 15,
                                color: '#D5D1F5',
                            }}
                        >
                            FEATURED
                        </Text>

                        <Text
                            style={{
                                ...styles.textTiltle,
                                fontSize: 18,
                                width: '100%',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            Take part in challenges with friends or other
                            players
                        </Text>

                        <TouchableOpacity
                            style={styles.btnFindFriends}
                            onPress={() => {
                                navigation.navigate('JoinGame');
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="people-circle"
                                    size={24}
                                    color={colors.primary}
                                />
                                <Text
                                    style={{
                                        ...styles.textHeader,
                                        fontSize: 15,
                                        marginLeft: 10,
                                        color: colors.primary,
                                    }}
                                >
                                    Join Game
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Status Find Live Quizzes */}
                <View
                    style={{
                        height: '100%',
                    }}
                >
                    <SubLayout>
                        <View style={styles.viewLoading}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                        <View style={styles.headerContainer}>
                            <Text
                                style={{ ...styles.textHeader, fontSize: 18 }}
                            >
                                My Library
                            </Text>

                            <TouchableOpacity
                                style={{
                                    paddingVertical: 2,
                                    paddingLeft: 3,
                                }}
                            >
                                <Text style={styles.buttonText}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        {isLoading ? (
                            <View style={styles.viewLoading}>
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        ) : (
                            <View>
                                {quizes.map((quizData, index) => (
                                    <BoxQuiz
                                        key={index}
                                        quizData={quizData}
                                        navigation={navigation}
                                        direct="DetailQuiz"
                                        mylibrary={true}
                                    />
                                ))}
                            </View>
                        )}
                    </SubLayout>
                </View>
            </ScrollView>
            <Toast />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 20,
        alignItems: 'center',
    },
    firstSection: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    userHeader: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    weather: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    subText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FED7DD',
        marginLeft: 6,
    },
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    textTiltle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#8B3342',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover',
    },
    recentQuiz: {
        height: 80,
        marginTop: 30,
        width: '100%',
        backgroundColor: '#FFE0E6',
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
    },
    boxFindFriend: {
        height: 240,
        width: '100%',
        backgroundColor: '#8F87E5',
        marginVertical: 25,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'space-between',
        padding: 30,
        alignItems: 'center',
    },
    btnFindFriends: {
        height: 50,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 20,
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.primary,
    },
});
