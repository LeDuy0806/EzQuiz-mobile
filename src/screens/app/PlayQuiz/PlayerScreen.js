import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';
import WaitingRoom from './WaitingRoom';
import QuestionScreen from './QuestionScreen';
import QuesntionLeaderboard from './QuesntionLeaderboard';
import LeaderBoardCurrent from './Leaderboardcurrent';
import ResultScreen from './ResultScreen';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import correctAnswer from 'src/assets/images/correctAnsswer.png';
import wrong from 'src/assets/images/wrong.png';
import CheckResultScreen from './CheckResult/CheckResultScreen';

let arrayAnswer = [];

export default function PlayerScreen({ navigation, ...props }) {
    const userData = useSelector((state) => state.auths?.authData);
    const playerId = userData?.data?.user?._id;

    const lengthQuiz = props.route.params.length;
    const poitperQuestion = props.route.params.pointsPerQuestion;
    const pinGame = props.route.params.gamePin;
    const gameId = props.route.params.gameId;
    const leaderboardID = props.route.params.leaderboardID;
    const playerList = props.route.params.playerList;

    const [questionSend, setQuestionSend] = useState([]);

    const [questionData, setQuestionData] = useState();
    const [timeAlready, setTimeAlready] = useState(true);
    const [isQuestionScreen, setIsQuestionScreen] = useState(false);
    const [isResultScreen, setIsResultScreen] = useState(false);
    const [isResultFinal, setIsResultFinal] = useState(false);
    const [isCheckAnswerScreen, setIsCheckAnswerScreen] = useState(false);
    const [seenLeaderboard, setSeenLeaderboard] = useState(false);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionOptionCurrent, setQuestionOptionCurrent] = useState();
    const [questionpointType, setQuestionpointType] = useState();
    const [scorePlayer, setScorePlayer] = useState([]);
    const [expireTimeQuestion, setExpireTimeQuestion] = useState(false);
    const [trueAnswer, setTrueAnswer] = useState(true);

    const [timerQuestion, setTimerQuestion] = useState(0);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(1);

    const [timer, setTimer] = useState(10);
    const [answer, setAnswer] = useState([]);

    const [resultDetail, setResultDetails] = useState({
        correctAnswer: 0,
        noAnswer: 0,
        incorrectAnswer: 0,
        pointSum: 0,
    });

    const socket = useSelector((state) => state.sockets.socket);

    const [addAnswer, setAddAnswers] = useState(false);
    const [leaderboardResult, setLeaderboardResults] = useState([]);

    useEffect(() => {
        if (isResultFinal) {
            const listTimerAnswer = answer.map((item) => item.time);
            const listIndexQuestion = answer.map((item) => item.questionIndex);
            setResultDetails({
                ...resultDetail,
                listTimerAnswer,
                listIndexQuestion,
            });
        }
    }, [isResultFinal]);

    useEffect(() => {
        arrayAnswer = [];
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (scorePlayer.length) {
            let data = {
                questionIndex: answer[currentQuestionIndex - 1]?.questionIndex,
                playerId,
                playerPoints: scorePlayer[currentQuestionIndex - 1],
            };
            let score = resultDetail.pointSum;
            socket.emit(
                'send-answer-to-host',
                data,
                score,
                pinGame,
                leaderboardID,
            );
        }
    }, [scorePlayer]);

    const calculPoint = () => {
        switch (questionpointType) {
            case 'Standard':
                return poitperQuestion;
            case 'Double':
                return poitperQuestion * 2;
            default:
                break;
        }
    };

    useEffect(() => {
        if (expireTimeQuestion) {
            const answerPlayer = answer[currentQuestionIndex - 1].answers;
            const answerQuestion = questionData.answerCorrect;

            let wrong = false;
            //Handle Answer player
            if (answerPlayer.length === answerQuestion.length) {
                answerPlayer.map((item) => {
                    if (!answerQuestion.includes(item)) {
                        wrong = true;
                        setResultDetails({
                            ...resultDetail,
                            incorrectAnswer: resultDetail.incorrectAnswer + 1,
                        });
                    }
                });

                if (wrong === true) {
                    setTrueAnswer(false);
                    setScorePlayer([...scorePlayer, 0]);
                } else {
                    const score = calculPoint();
                    setResultDetails({
                        ...resultDetail,
                        correctAnswer: resultDetail.correctAnswer + 1,
                        pointSum: resultDetail.pointSum + score,
                    });
                    setScorePlayer([...scorePlayer, score]);
                }
            } else {
                setTrueAnswer(false);
                if (answerPlayer.length === 0) {
                    setResultDetails({
                        ...resultDetail,
                        noAnswer: resultDetail.noAnswer + 1,
                    });
                } else {
                    setResultDetails({
                        ...resultDetail,
                        incorrectAnswer: resultDetail.incorrectAnswer + 1,
                    });
                }
                setScorePlayer([...scorePlayer, 0]);
            }
        }
    }, [expireTimeQuestion]);

    useEffect(() => {
        socket?.on('host-countdown-preview', () => {
            setTimeAlready(true);
            StartCountDownPreview(10);
        });
        socket?.on('host-start-question-timer', (time, question) => {
            setTimerQuestion(time);
            setIsResultScreen(false);
            setQuestionData(question.questionData);
            setQuestionSend((prevstate) => [
                ...prevstate,
                question.questionData,
            ]);
            setQuestionOptionCurrent(question.questionData.optionQuestion);
            setQuestionpointType(question.questionData.pointType);
            setCurrentQuestionIndex((prevstate) => prevstate + 1);
            setIsQuestionScreen(true);
            setAnswer((prevstate) => [
                ...prevstate,
                {
                    questionIndex: question.questionIndex,
                    answers: [],
                    time: 0,
                },
            ]);
            setCorrectAnswerCount(question.correctAnswersCount);
            startQuestionCountdown(time);
        });
        socket?.on('host-end-gamee', () => {
            setIsResultScreen(false);
            setIsResultFinal(true);
        });
    }, [socket]);

    const StartCountDownPreview = (seconds) => {
        let time = seconds;
        let interval = setInterval(() => {
            setTimer(time);
            if (time === 0) {
                clearInterval(interval);
                // setQuestionData(question.questionData);
                setTimeAlready(false);
                setIsQuestionScreen(true);
            }
            time--;
        }, 1000);
    };

    const startQuestionCountdown = (seconds) => {
        setTrueAnswer(true);
        setExpireTimeQuestion(false);
        setIsQuestionScreen(true);

        let time = seconds;
        let answerSeconds = 0;
        let interval = setInterval(() => {
            setTimer(time);
            if (time === 0) {
                clearInterval(interval);
                setExpireTimeQuestion(true);
                setIsQuestionScreen(false);
                setIsResultScreen(true);
            }
            time--;
            answerSeconds++;
        }, 1000);
    };

    const handleAnswer = (key) => {
        if (!arrayAnswer.includes(key)) {
            arrayAnswer.push(key);
        } else {
            arrayAnswer = arrayAnswer.filter((item) => item !== key);
        }
        setAnswer([
            ...answer.slice(0, currentQuestionIndex - 1),
            {
                answers:
                    questionOptionCurrent === 'Single' ? [key] : arrayAnswer,
                questionIndex: currentQuestionIndex,
                time: timer,
            },
            ...answer.slice(currentQuestionIndex + 1, answer.length),
        ]);
    };

    const handleExit = () => {
        navigation.navigate('JoinGame');
    };

    const handleFinish = () => {
        console.log('End ha');
    };

    const handleCompareResult = () => {
        setIsResultFinal(false);
        setIsCheckAnswerScreen(true);
    };

    const handleSeenLeaderBoard = (leaderboard) => {
        setLeaderboardResults(leaderboard);
    };

    const handleOpenLeaderScreen = () => {
        setIsResultFinal(false);
        setSeenLeaderboard(true);
    };

    const handleBackResult = () => {
        setIsResultFinal(true);
        setSeenLeaderboard(false);
        setIsCheckAnswerScreen(false);
    };

    const handleBackLeaderboard = () => {
        setIsResultFinal(true);
        setSeenLeaderboard(false);
        setIsCheckAnswerScreen(false);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                    timer={timerQuestion}
                    questionData={questionData}
                    lengthQuiz={lengthQuiz}
                    host={false}
                    isAnswerSelect={(key) =>
                        answer[currentQuestionIndex - 1]?.answers.includes(key)
                    }
                    onClick={(key) => handleAnswer(key)}
                />
            )}
            {isResultScreen &&
                (trueAnswer ? (
                    <AnswerCorrect
                        point={scorePlayer[currentQuestionIndex - 1]}
                    />
                ) : (
                    <AnswerWrong
                        point={scorePlayer[currentQuestionIndex - 1]}
                    />
                ))}
            {isResultFinal && (
                <ResultScreen
                    solo={false}
                    navigation={navigation}
                    finish={handleFinish}
                    result={resultDetail}
                    compareResult={handleCompareResult}
                    handleSeenLeaderBoard={handleSeenLeaderBoard}
                    playerId={playerId}
                    answer={answer}
                    leaderboardID={leaderboardID}
                    gameId={gameId}
                    scorePerQuestion={scorePlayer}
                    addAnswer={addAnswer}
                    handleExit={handleExit}
                    setAddAnswers={setAddAnswers}
                    handleOpenLeaderScreen={handleOpenLeaderScreen}
                />
            )}
            {isCheckAnswerScreen && (
                <CheckResultScreen
                    questionList={questionSend}
                    answer={answer}
                    handleBack={handleBackResult}
                />
            )}
            {seenLeaderboard && leaderboardResult && (
                <LeaderBoardCurrent
                    playerList={playerList}
                    currentLeaderboard={leaderboardResult}
                    handleBackLeaderboard={handleBackLeaderboard}
                />
            )}
        </SafeAreaView>
    );
}

const AnswerCorrect = ({ point }) => {
    return (
        <View style={{ ...styles.containerAnswer, backgroundColor: '#F1FDFF' }}>
            <Image
                style={{ width: '90%', height: '24%' }}
                source={correctAnswer}
            />
            <Text style={{ fontSize: 30, fontWeight: 800 }}>
                Your answer is correct
            </Text>
            <Text style={{ fontSize: 20 }}>Point Question: {point}</Text>
        </View>
    );
};

const AnswerWrong = ({ point }) => {
    return (
        <View style={{ ...styles.containerAnswer, backgroundColor: '#F69A2B' }}>
            <Image style={{ width: '80%', height: '30%' }} source={wrong} />
            <Text style={{ fontSize: 30, fontWeight: 800 }}>
                Your answer is wrong!
            </Text>
            <Text style={{ fontSize: 20 }}>Point Question: {point}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
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
