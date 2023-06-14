import React, { useEffect } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';

import { useAddPlayerResultMutation } from 'src/services/playerResultApi';
import { useGetLeaderBoardQuery } from 'src/services/leaderboardApi';
import champion from 'src/assets/images/champion.png';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { upDated } from 'src/slices/authSlice';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(39, 106,245, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
};

export default function ResultScreen({
    solo,
    navigation,
    finish,
    result,
    answer,
    quizData,
    playerId,
    leaderboardID,
    gameId,
    compareResult,
    scorePerQuestion,
    addAnswer,
    handleExit,
    setAddAnswers,
    handleSeenLeaderBoard,
    handleOpenLeaderScreen,
}) {
    const dispatch = useDispatch();
    const {
        correctAnswer,
        incorrectAnswer,
        listIndexQuestion,
        listTimerAnswer,
        noAnswer,
        pointSum,
    } = result;

    const { data } = useGetLeaderBoardQuery(leaderboardID);

    useEffect(() => {
        if (data) {
            const arangeLeader =
                data.currentLeaderboard[data.currentLeaderboard.length - 1];
            // const arangeLeader = data.currentLeaderboard[
            //     data.currentLeaderboard.length - 1
            // ].sort(function (a, b) {
            //     return b.point - a.point;
            // });
            if (arangeLeader.length > 1) {
                arangeLeader.sort(function (a, b) {
                    return b.point - a.point;
                });
            }

            handleSeenLeaderBoard(
                // data.currentLeaderboard[data.currentLeaderboard.length - 1],
                arangeLeader,
            );
        }
    }, [data]);

    const [addPlayerResult] = useAddPlayerResultMutation();

    useEffect(() => {
        const handleAddResult = async () => {
            if (!addAnswer && !solo) {
                answer.map((element) => {
                    if (element.time !== 0) {
                        element.answered = true;
                    } else {
                        element.answered = false;
                    }
                    element.points =
                        scorePerQuestion[element.questionIndex - 1];
                });

                const resultPlayer = {
                    score: pointSum,
                    answers: answer,
                };
                const { data } = await addPlayerResult({
                    playerId,
                    gameId,
                    results: resultPlayer,
                });
                if (data) {
                    dispatch(upDated(data.user));
                }
                setAddAnswers(true);
            }
        };
        handleAddResult();
    }, []);

    const dataChart = {
        labels: listIndexQuestion,
        datasets: [
            {
                data: listTimerAnswer ? listTimerAnswer : [1, 2, 3, 4],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2, // optional
            },
        ],
        legend: ['Time Answer'], // optional
    };

    // const handleCompare = () => {
    //     compareResult();
    // };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Finished!</Text>
                </View>
                <View style={styles.viewImage}>
                    <Image style={styles.image} source={champion} />
                    {solo ? (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textImage}>
                                Congratulations
                            </Text>
                            <Text style={styles.textImage}>
                                You finish quiz with {pointSum} Point
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.textImage}>
                            You get +{pointSum} Quiz Points
                        </Text>
                    )}
                    <TouchableOpacity
                        style={styles.viewCheckCorrect}
                        onPress={compareResult}
                    >
                        <Text style={styles.textImage}>
                            Check Corect Answer
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.accuration}>
                    <LineChart
                        data={dataChart}
                        width={screenWidth}
                        height={170}
                        chartConfig={chartConfig}
                    />
                </View>
                <View style={styles.viewInfo}>
                    <View style={styles.viewInfoItem}>
                        <Text style={styles.textInfoItemName}>
                            CORRECT ANSWER
                        </Text>
                        <Text style={styles.textInfoItemResult}>
                            {correctAnswer} question
                        </Text>
                    </View>
                    <View style={styles.viewInfoItem}>
                        <Text style={styles.textInfoItemName}>COMPLETION</Text>
                        <Text style={styles.textInfoItemResult}>
                            {listIndexQuestion &&
                                Math.floor(
                                    ((correctAnswer + incorrectAnswer) * 100) /
                                        listIndexQuestion.length,
                                )}
                            %
                        </Text>
                    </View>
                </View>

                <View style={styles.viewInfo}>
                    <View style={styles.viewInfoItem}>
                        <Text style={styles.textInfoItemName}>NO ANSWER</Text>
                        <Text style={styles.textInfoItemResult}>
                            {noAnswer}
                        </Text>
                    </View>
                    <View style={styles.viewInfoItem}>
                        <Text style={styles.textInfoItemName}>
                            INCORRECT ANSWER
                        </Text>
                        <Text style={styles.textInfoItemResult}>
                            {incorrectAnswer}
                        </Text>
                    </View>
                </View>

                {solo ? (
                    // <View style={{width:'100%'}}>
                    <TouchableOpacity
                        // style={styles.footer}
                        style={styles.viewExitSolo}
                        onPress={finish}
                    >
                        <Text style={styles.textFooter}>Exit</Text>
                    </TouchableOpacity>
                ) : (
                    // </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: '7%',
                            width: '80%',
                        }}
                    >
                        <TouchableOpacity
                            style={styles.footer}
                            onPress={handleExit}
                        >
                            <Text style={styles.textFooter}>Exit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.footer}
                            onPress={handleOpenLeaderScreen}
                        >
                            <Text style={styles.textFooter}>LeaderBoard</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        height: '100%',
        width: '100%',
    },

    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0DEF9',
    },

    header: {
        width: '90%',
        height: '7%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    viewCheckCorrect: {
        height: '16%',
        backgroundColor: '#FFCACA',
        borderRadius: 10,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textHeader: {
        fontSize: 20,
        fontWeight: 800,
    },

    viewImage: {
        width: '90%',
        height: '36%',
        backgroundColor: '#FFACAC',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    image: {
        width: '50%',
        height: '40%',
    },

    textImage: {
        fontSize: 20,
        color: '#fff',
    },

    accuration: {
        width: '90%',
        height: '27%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    viewInfo: {
        width: '90%',
        height: '8%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    viewInfoItem: {
        width: '40%',
        height: '100%',
        gap: 10,
    },

    textInfoItemName: {
        fontSize: 12,
        fontWeight: 600,
        color: 'gray',
    },

    textInfoItemResult: {
        fontWeight: 800,
    },

    viewExitSolo: {
        height: '7%',
        backgroundColor: '#695AE0',
        width: '80%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    footer: {
        width: '42%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#695AE0',
    },

    textFooter: {
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
    },
});
