import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { colors } from 'src/styles/color';
import logo from 'src/assets/images/logo.png';
import images from 'src/constants/images';
export default function WaitingRoom({
    pin,
    solo,
    socket,
    quizData,
    navigation,
    onPressLetgo,
    onPressCanCel,
    handlePlayerJoin,
    handlePlayerLeave,
}) {
    const [playerList, setPlayerList] = useState([]);
    useEffect(() => {
        socket?.on('player-added', (player, pinGameCurrent) => {
            if (pin === pinGameCurrent) {
                handlePlayerJoin(player);
                // Add player
                setPlayerList([...playerList, player]);
            }
        });
        return () => {
            socket?.off('player-added');
        };
    }, [playerList, socket, pin]);

    useEffect(() => {
        socket?.on(
            'notify-student-leave-JoinRoom',
            (player, pinGameCurrent) => {
                if (pin === pinGameCurrent) {
                    handlePlayerLeave(player);
                    setPlayerList(
                        playerList.filter(
                            (item) => item.userName !== player.userName,
                        ),
                    );
                }
            },
        );
        return () => {
            socket?.off('notify-studen-leave-JoinRoom');
        };
    }, [[playerList, socket, pin]]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ ...styles.viewAll, gap: solo ? 100 : 20 }}>
                {pin && <Text style={styles.viewPin}>Show PIN: {pin}</Text>}
                <View style={styles.viewHeader}>
                    <View style={styles.viewQuiz}>
                        <View style={styles.viewQuizHeader}>
                            <Text style={styles.viewTitle}>
                                {quizData.name}
                            </Text>
                            <Image
                                style={styles.viewImage}
                                source={{
                                    uri: quizData.backgroundImage
                                        ? quizData?.backgroundImage
                                        : images.defaultAvatar,
                                }}
                            />
                            <Text style={{ textAlign: 'center' }}>
                                {/* What will you do when your girlfriend go to
                                hotel with another man */}
                                {quizData.description}
                            </Text>
                        </View>
                        {/* <Divider color="gray"></Divider> */}
                        <View style={styles.viewQuizMore}>
                            <Text>Creator: {quizData.creatorName}</Text>
                            <Text>
                                {quizData.questionList.length} questions
                            </Text>
                        </View>
                    </View>
                </View>
                {!solo && (
                    <View style={styles.viewPlayer}>
                        <Text style={{ fontSize: 20, textAlign: 'center' }}>
                            Player List
                        </Text>
                        {!playerList.length && <Text>No player here</Text>}
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={playerList}
                            renderItem={({ item }) => (
                                <View style={{ alignItems: 'center' }}>
                                    <UserJoin index={item} />
                                </View>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 20 }} />
                            )}
                        />
                    </View>
                )}

                <View style={styles.viewButton}>
                    <TouchableOpacity onPress={onPressCanCel}>
                        <View
                            style={{
                                ...styles.buttonItem,
                                backgroundColor: '#DFDFDE',
                            }}
                        >
                            <Text>Cancle</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressLetgo}>
                        <View
                            style={{
                                ...styles.buttonItem,
                                backgroundColor: '#16FF00',
                            }}
                        >
                            <Text>OK,Lets'go</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export const UserJoin = ({ index }) => {
    return (
        <View style={styles.viewUser}>
            <View style={styles.viewCount}>
                <View style={styles.viewCountCircle}>
                    <Text style={{ color: '#000' }}>{1}</Text>
                </View>
            </View>
            <View style={styles.viewUserImage}>
                <Image
                    style={styles.imageUser}
                    source={{
                        uri: index.avatar
                            ? index.avatar
                            : 'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-cute.jpg?ssl\u003d1',
                    }}
                />
                <View>
                    <Text>{index.userName}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: colors.lightPurple,
    },

    viewAll: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },

    viewHeader: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
    },

    viewPin: {
        // marginTop: 10,
        color: '#fff',
        fontSize: 24,
    },

    viewTitle: {
        color: '#000',
        fontSize: 22,
        textAlign: 'center',
    },

    viewQuiz: {
        height: '140%',
        width: '70%',
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    viewQuizHeader: {
        height: '80%',
        width: '92%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    viewImage: {
        width: '50%',
        height: '40%',
        resizeMode: 'contain',
    },
    viewQuizMore: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    viewPlayer: {
        backgroundColor: '#F1F6F9',
        height: '40%',
        width: '70%',
        marginTop: 60,
        flexDirection: 'column',
        borderRadius: 20,
        alignItems: 'center',
    },

    viewButton: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    buttonItem: {
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },

    viewUser: {
        width: '100%',
        height: 60,
        backgroundColor: '#F48484',
        borderRadius: 10,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
    },
    viewCount: {
        width: '10%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        left: 10,
    },
    viewCountCircle: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderColor: '#DBDFEA',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    viewUserImage: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        left: 10,
    },

    imageUser: {
        width: 40,
        height: 40,
        borderRadius: 50,
        resizeMode: 'contain',
    },
});
