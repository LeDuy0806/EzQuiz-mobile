import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import WaitingRoom from './WaitingRoom';
import QuestionScreen from './QuestionScreen';
import QuesntionLeaderboard from './QuesntionLeaderboard';
import LeaderBoardCurrent from './Leaderboardcurrent';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

import {
    useUpdateQuestionleaderboardMutation,
    useUpdateCurrentleaderboardMutation,
} from 'src/services/leaderboardApi';

const InitQuizData = {
    questionType: 'Quiz',
    pointType: 'Standard',
    answerTime: 5,
    backgroundImage: '',
    question: '',
    answerList: [
        { name: 'a', body: '', isCorrect: false },
        { name: 'b', body: '', isCorrect: false },
        { name: 'c', body: '', isCorrect: false },
        { name: 'd', body: '', isCorrect: false },
    ],
    questionIndex: 1,
};

let CorrectAnswer = [];

export default function HostScreen({ navigation }) {
    // const game = props.route.params.newGame;
    // const leaderboard = props.route.params.newLeaderboard;

    // const [quizData, setQuizData] = useState(props.route.params.quizData);
    // const [game, setGame] = useState(props.route.params.quizData);
    // const [leaderboard, setLeaderboard] = useState(
    //     props.route.params.newLeaderboard,
    // );

    const [correct, setCorrect] = useState();

    const socket = useSelector((state) => state.sockets.socket);
    const quiz = useSelector((state) => state.quizs.quiz);
    const length = quiz.questionList.length;
    const game = useSelector((state) => state.games.game);
    const leaderboard = useSelector((state) => state.leaderboards.leaderboard);

    const [updateQuestion] = useUpdateQuestionleaderboardMutation();
    const [updateCurrent] = useUpdateCurrentleaderboardMutation();
    const [playerList, setPlayerList] = useState([]);

    useEffect(() => {
        CorrectAnswer = [];
        quiz.questionList.map((question) => {
            question.answerList.map((answer) => {
                if (answer.isCorrect === true) {
                    return (
                        !CorrectAnswer.includes(answer.body) &&
                        CorrectAnswer.push(answer.body)
                    );
                }
            });
        });
        setCorrect(CorrectAnswer);
    }, []);

    const [isStartedGame, setIsStaretedGame] = useState(false);
    const [timeAlready, setTimeAlready] = useState(false);
    const [isQuestionScreen, setIsQuestionScreen] = useState(false);
    const [isQuestionResultScreen, setIsQuestionResultScreen] = useState(false);
    const [isLeaderboardScreen, setIsLeaderboardScreen] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionData, setQuestionData] = useState(InitQuizData);
    const [timer, setTimer] = useState(10);

    const [questionResult, setQuestionResult] = useState(
        leaderboard?.questionLeaderboard[0],
    );
    const [currentLeaderboard, setCurrentLeaderboard] = useState(
        leaderboard?.currentLeaderboard[0],
    );

    useEffect(() => {
        socket?.on(
            'get-answer-from-player',
            (data, leaderboardId, score, player) => {
                updateLeaderboard(data, leaderboardId, score);
                let playerData = {
                    id: data.playerId,
                    userName: player.userName,
                };
                setPlayerList((prevstate) => [...prevstate, playerData]);
            },
        );
        return () => {
            socket.off('get-answer-from-player');
        };
    }, [socket]);

    const updateLeaderboard = async (data, id, score) => {
        let questionleaderboard = await updateQuestion({
            leaderboardId: id,
            update: data,
        });
        let arrangeQuestion =
            questionleaderboard.data.questionLeaderboard[
                data.questionIndex - 1
            ];
        if (arrangeQuestion > 1) {
            arrangeQuestion.sort(function (a, b) {
                return b.playerPoints - a.playerPoints;
            });
        }

        setQuestionResult(arrangeQuestion);

        let leaderboardData = {
            questionIndex: data.questionIndex,
            playerId: data.playerId,
            playerCurrentScore: score,
        };
        let currentleaderboard = await updateCurrent({
            leaderboardId: id,
            update: leaderboardData,
        });
        let arrangeLeader =
            currentleaderboard.data.currentLeaderboard[data.questionIndex - 1];

        if (arrangeLeader.length > 1) {
            arrangeLeader.sort(function (a, b) {
                return b.playerCurrentScore - a.playerCurrentScore;
            });
        }

        setCurrentLeaderboard(arrangeLeader);
    };

    const handlePlayerJoin = (playerData) => {
        setPlayerList((prevstate) => [...prevstate, playerData]);
    };

    const handlePlayerLeave = (playerData) => {
        setPlayerList(
            playerList.filter((item) => item.userName !== playerData.userName),
        );
    };

    const StartGame = () => {
        socket?.emit(
            'start-game',
            game,
            leaderboard,
            length,
            playerList,
            quiz.pointsPerQuestion,
        );
        socket?.emit('countdown-preview', game?.pin, () => {
            StartCountDownPreview(10, currentQuestionIndex);
        });

        setTimeAlready(true);
        setIsStaretedGame(true);
    };

    const cancelGame = () => {
        socket?.emit('host-leave-WattingRoom', game?.pin);
        navigation.navigate('DetailQuiz', { quizData: quiz, mylibrary: true });
    };

    const StartCountDownPreview = (seconds, index) => {
        let time = seconds;
        let interval = setInterval(() => {
            setTimer(time);
            if (time === 0) {
                clearInterval(interval);
                displayQuestion(index);
                setTimeAlready(false);
                setIsQuestionScreen(true);
            }
            time--;
        }, 1000);
    };

    const displayQuestion = (index) => {
        if (index === quiz.questionList.length) {
            displayCurrentLeaderBoard(index);
        } else {
            setQuestionData(quiz.questionList[index]);
            setCurrentQuestionIndex((prevstate) => prevstate + 1);
            let time = quiz.questionList[index].answerTime;
            let question = {
                questionData: quiz.questionList[index],
                answerList: quiz.questionList[index].answerList,
                questionIndex: quiz.questionList[index].questionIndex,
                correctAnswersCount: quiz.questionList[index].answerList.filter(
                    (answer) => answer.isCorrect === true,
                ).length,
            };
            socket.emit(
                'start-question-timer',
                game.pin,
                time,
                question,
                () => {
                    startQuestionCountdown(time, index);
                },
            );
        }
    };

    const startQuestionCountdown = (seconds, index) => {
        setIsLeaderboardScreen(false);
        setIsQuestionScreen(true);
        let time = seconds;
        let interval = setInterval(() => {
            setTimer(time);
            if (time === 0) {
                clearInterval(interval);
                displayQuestionResult(index);
            }
            time--;
        }, 1000);
    };

    const displayQuestionResult = (index) => {
        setIsQuestionScreen(false);
        setIsQuestionResultScreen(true);
        setTimeout(() => {
            displayCurrentLeaderBoard(index);
        }, 4000);
    };

    const displayCurrentLeaderBoard = (index) => {
        setIsQuestionResultScreen(false);
        setIsLeaderboardScreen(true);
        if (index >= quiz.questionList.length - 1) {
            socket.emit('host-end-game', game?.pin);
        } else {
            setTimeout(() => {
                displayQuestion(index + 1);
            }, 4000);
        }
    };

    const handleExitGame = () => {
        navigation.navigate('DetailQuiz', { quizData: quiz, mylibrary: true });
    };

    return (
        <SafeAreaView style={styles.container}>
            {!isStartedGame && (
                <WaitingRoom
                    pin={game.pin}
                    socket={socket}
                    quizData={quiz}
                    navigation={navigation}
                    onPressLetgo={StartGame}
                    onPressCanCel={cancelGame}
                    handlePlayerJoin={handlePlayerJoin}
                    handlePlayerLeave={handlePlayerLeave}
                />
            )}
            {timeAlready && (
                <View style={styles.viewTimerAlready}>
                    <LinearGradient
                        // Button Linear Gradient
                        colors={['#8ec5fc', '#e0c3fc']}
                        style={styles.viewPreview}
                    >
                        <Text style={{ fontSize: 100, fontWeight: 400 }}>
                            {timer}
                        </Text>
                    </LinearGradient>
                </View>
            )}
            {isQuestionScreen && (
                <QuestionScreen
                    timer={questionData.answerTime}
                    questionData={questionData}
                    lengthQuiz={quiz.questionList.length}
                    host={true}
                    correctAnswer={correct}
                />
            )}
            {isQuestionResultScreen && questionResult && (
                <QuesntionLeaderboard
                    playerList={playerList}
                    questionResult={questionResult}
                />
            )}
            {isLeaderboardScreen && currentLeaderboard && (
                <LeaderBoardCurrent
                    playerList={playerList}
                    currentLeaderboard={currentLeaderboard}
                    lengthQuiz={quiz.questionList.length}
                    handleExitGame={handleExitGame}
                    host={true}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    viewTimerAlready: {
        width: '100%',
        height: '100%',
    },
    viewPreview: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerAnswer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 100,
    },

    imageAnswer: {
        width: '50%',
        height: '24%',
    },
});
