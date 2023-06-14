// Library
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Pressable,
    ToastAndroid,
    SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Layout
import { MainLayout } from 'src/layouts';

import AnswerInput from './AnswerInput';

// Constant
import { timeLimit } from 'src/constants/time.constant';
import { questionTypes } from 'src/constants/questionTypes.constant';
import { pointTypes } from 'src/constants/pointTypes.constant';
import { optionQuestions } from 'src/constants/optionQuestion';

// Actions
import {
    addQuestion,
    changeActiveQuestionIndex,
    changeActiveQuestionInfo,
    changeQuestionInfo,
    deleteQuestion,
    duplicateQuestion,
} from 'src/slices/creatorSlice';

import { ModalQuiz } from './Modal';

// Component
import {
    Button,
    CoverImage,
    Header,
    PoolAnswer,
    TrueOrFalseAnswer,
} from 'src/components/creator';
import { bgColors, colors } from 'src/styles/color';
import { useEffect } from 'react';
import Item from './Item';

// import { useSelector } from 'react-redux';
import { useAddQuestionMutation } from 'src/services/quizApi';
import { useDeleteQuestionMutation } from 'src/services/quizApi';
import { updateQuiz } from 'src/slices/quizSlice';
import { useCallback } from 'react';

const InitQuestion = {
    questionType: 'Quiz',
    optionQuestion: 'Single',
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
    maxCorrectAnswer: 1,
    correctAnswerCount: 0,
    answerCorrect: [],
};

const AddQuestion = ({ navigation, ...props }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auths?.authData);
    const accessToken = userData?.data?.accessToken;

    const [questionList, setQuestionList] = useState([]);
    const quiz = props.route.params.quiz;
    const creator = props.route.params.creator;
    const importQuiz = props.route.params?.import;

    const [initQuestion] = useAddQuestionMutation();
    const [deleteQuestion, { isLoading }] = useDeleteQuestionMutation();

    useFocusEffect(
        useCallback(() => {
            setQuestionList(quiz.questionList);
        }, [quiz]),
    );

    const handleAddQuestion = async () => {
        const { data } = await initQuestion({
            accessToken,
            quizId: quiz._id,
            newQuestion: {
                ...InitQuestion,
                questionIndex: questionList.length + 1,
            },
        });
        if (data) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    'Add question successfully!',
                    ToastAndroid.SHORT,
                );
            } else {
                AlertIOS.alert('Add question successfully!');
            }
            const { Question, quiz } = data;
            dispatch(updateQuiz(quiz));
            setQuestionList([...questionList, Question]);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        const { data } = await deleteQuestion({
            accessToken,
            quizId: quiz._id,
            questionId,
        });
        if (data) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    'Delete question successfully!',
                    ToastAndroid.SHORT,
                );
            } else {
                AlertIOS.alert('Delete question successfully!');
            }
            dispatch(updateQuiz(data));
            setQuestionList(data.questionList);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headers}>
                <Header
                    add={true}
                    title="Add Question"
                    style={styles.header}
                    navigation={navigation}
                    direct="Creator"
                    creator={creator}
                    quiz={quiz}
                    addQuestion={handleAddQuestion}
                    importQuiz={importQuiz}
                />
            </View>
            <View style={styles.mainContent}>
                <ScrollView
                    contentContainerStyle={styles.pagination}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {questionList &&
                        questionList.map((question) => (
                            <Item
                                key={question.questionIndex}
                                quizId={quiz._id}
                                data={question}
                                length={questionList.length}
                                handleAddQuestion={(InitQuestion) =>
                                    handleAddQuestion(InitQuestion)
                                }
                                handleDeleteQuestion={(InitQuestion) =>
                                    handleDeleteQuestion(InitQuestion)
                                }
                                loadingDelete={isLoading}
                            />
                        ))}
                    {!questionList.length && (
                        <Text
                            style={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                fontSize: 20,
                            }}
                        >
                            No question here
                        </Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AddQuestion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: 16,
        alignItems: 'center',
    },
    headers: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    mainContent: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#695AE0',
        // backgroundColor: '#fff',

        borderRadius: 35,
        marginTop: 25,
        padding: 15,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll',
        height: 1000,
    },
    questionIndex: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        width: 30,
        height: 30,
        borderRadius: 999,
    },
    questionContainer: {
        marginTop: 10,
        paddingBottom: 10,
    },
    settings: {
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
    },
    settingBtn: {
        borderWidth: 3,
        borderColor: bgColors.lightPurple,
        borderRadius: 99,
        paddingVertical: 5,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
    },
    label: {
        fontSize: 20,
        fontWeight: 600,
    },
    input: {
        marginTop: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 18,
    },
    button: {
        width: '50%',
        backgroundColor: colors.lightPurple,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 20,
    },

    text: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },

    // Options Modal
    optionsCenteredView: {
        flex: 1,
        paddingTop: 80,
        paddingRight: 20,
        alignItems: 'flex-end',
    },
    optionsModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    optionsBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
    },
    optionsText: {
        fontSize: 16,
        marginLeft: 10,
    },

    //Time and Question Type Modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        padding: 10,
    },
    modalView: {
        width: '100%',
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        elevation: 5,
        borderColor: colors.lightPurple,
        borderWidth: 5,
    },
    timeLimitGroup: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeLimitBtn: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    timeLimitText: {
        fontSize: 16,
    },
});
