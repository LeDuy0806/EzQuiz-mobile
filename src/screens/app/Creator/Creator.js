// Library
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    ToastAndroid,
    SafeAreaView,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

//HandleFile
import * as DocumentPicker from 'expo-document-picker';
import {
    cacheDirectory,
    readAsStringAsync,
    copyAsync,
    getInfoAsync,
    makeDirectoryAsync,
} from 'expo-file-system';

const createCacheFile = async ({ name, uri }) => {
    if (!(await getInfoAsync(cacheDirectory + 'uploads/')).exists) {
        await makeDirectoryAsync(cacheDirectory + 'uploads/');
    }
    const cacheFilePath = cacheDirectory + 'uploads/' + name;
    await copyAsync({ from: uri, to: cacheFilePath });
    return cacheFilePath;
};

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { createQuiz, updateQuiz } from 'src/slices/quizSlice';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';

//constant Modal
import { typeQuiz } from 'src/constants/public.constant';
import { PointsPer } from 'src/constants/pointPerQuestion.constant';
import { categories } from 'src/constants/category.constant';
import { bgColors, colors } from 'src/styles/color';

// Component
import { Header } from 'src/components/creator';
import { ModalQuiz, ModalQuizArray, ModalNote } from './Modal';
import ImageUpload from 'src/components/creator/imageUpload';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

//Call api
import { useCreateQuizMutation } from 'src/services/quizApi';
import { useUpdateQuizMutation } from 'src/services/quizApi';

const categorieArary = categories.map((item) => item.name);
const InitQuizData = {
    name: '',
    backgroundImage: '',
    description: '',
    pointsPerQuestion: 1,
    numberOfQuestions: 0,
    isPublic: true,
    tags: [],
    questionList: [],
};

export default Creator = ({ navigation, ...props }) => {
    const [coverImage, setCoverImage] = useState(null);
    const [file, setFile] = useState(null);

    const [importQuiz, setImportQuiz] = useState(false);

    const quiz = props.route.params.quiz;
    const creator = props.route.params.creator;
    const fresh = props.route.params.fresh;

    useFocusEffect(
        useCallback(() => {
            setImportQuiz(false);
            setFile(null);
        }, [fresh]),
    );

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auths?.authData);
    const userName = userData?.data?.user?.userName;
    const creatorId = userData?.data?.user?._id;

    const accessToken = userData?.data?.accessToken;

    const [quizData, setQuizData] = useState({
        ...InitQuizData,
        creatorName: userName,
    });

    useFocusEffect(
        useCallback(() => {
            if (quiz && !creator) {
                const Quiz = {
                    name: quiz.name,
                    backgroundImage: quiz.backgroundImage || '',
                    description: quiz.description,
                    pointsPerQuestion: quiz.pointsPerQuestion,
                    numberOfQuestions: quiz.numberOfQuestions,
                    isPublic: quiz.isPublic,
                    tags: quiz.tags,
                    questionList: quiz.questionList,
                };
                setQuizData({
                    ...Quiz,
                    _id: quiz._id,
                    creatorName: userName,
                });
            } else {
                setQuizData({
                    ...InitQuizData,
                    creatorName: userName,
                    backgroundColor: file,
                });
            }
        }, [quiz]),
    );

    const {
        name,
        creatorName,
        backgroundImage,
        description,
        pointsPerQuestion,
        numberOfQuestions,
        isPublic,
        tags,
        questionList,
    } = quizData;

    const quizType = isPublic ? 'Public' : 'Private';

    const [isPublicQuizModal, setIsPublicQuizModal] = useState(false);
    const [isCategoriesModal, setIsCategoriesModal] = useState(false);
    const [pointperQuestionModal, setPointperQuestionModal] = useState(false);
    const [saveQuizModal, setSaveQuizModal] = useState(false);
    const [load, setLoad] = useState(false);

    const [InitQuiz, { isLoading, error }] = useCreateQuizMutation();
    const [InitUpdate] = useUpdateQuizMutation();

    useEffect(() => {
        if (error) {
            switch (error.data) {
                case 'Quiz already exists':
                    ToastAndroid;
                    setSaveQuizModal(!saveQuizModal);
                    showToasts('error', 'Quiz valid', 'Quiz already exists!');

                    break;
                case 'All fields are mandatory!':
                    setSaveQuizModal(!saveQuizModal);
                    showToasts(
                        'error',
                        'Quiz valid',
                        'Please fill in full infomation',
                    );
                    break;
                default:
                    break;
            }
        }
    }, [error]);

    const handleQuizChange = (key, name) => {
        setQuizData({ ...quizData, [name]: key });
    };

    const showToasts = (status, text1, text2) => {
        Toast.show({
            type: status,
            text1: text1,
            text2: text2,
            visibilityTime: 2500,
            topOffset: 60,
        });
    };

    const handleSaveQuiz = async () => {
        if (creator) {
            const { data } = await InitQuiz({
                accessToken,
                quizData: {
                    ...quizData,
                    backgroundImage: file ? file : quizData.backgroundImage,
                    creatorName: userName,
                },
            });
            if (data) {
                setCoverImage(null);
                setSaveQuizModal(!saveQuizModal);
                setImportQuiz(true);
                ToastAndroid.show(
                    'Creat Quiz successfully',
                    ToastAndroid.SHORT,
                );
                dispatch(createQuiz(data));
                setQuizData({
                    ...InitQuizData,
                    creatorName: userName,
                });
                navigation.navigate('AddQuestion', {
                    quiz: data,
                    creator: true,
                });
            }
        } else {
            const { data, isLoading } = await InitUpdate({
                accessToken,
                quizId: quizData._id,
                updateQuiz: {
                    ...quizData,
                    backgroundImage: file ? file : quizData.backgroundImage,
                },
            });
            if (data) {
                setSaveQuizModal(!saveQuizModal);
                showToasts(
                    'success',
                    'Successfully !',
                    'Save quiz successfully!',
                );
                dispatch(updateQuiz(data));
            }
        }
    };

    const handleImportQuiz = async () => {
        setSaveQuizModal(!saveQuizModal);
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false,
            type: 'application/json',
            multiple: false,
        });

        const cacheFile = await createCacheFile({
            name: result.name,
            uri: result.uri,
        });

        const content = await readAsStringAsync(cacheFile, {
            encoding: 'utf8',
        });
        const quiz = JSON.parse(content);
        setQuizData({
            ...quiz,
            creatorId,
            creatorName: userName,
        });
        setSaveQuizModal(!saveQuizModal);
    };

    const showQuestionDetail = () => {
        setSaveQuizModal(!saveQuizModal);
        navigation.navigate('AddQuestion', { quiz, creator: false });
    };

    const showQuestionDetailImport = () => {
        setSaveQuizModal(!saveQuizModal);
        navigation.navigate('AddQuestion', {
            quiz: quizData,
            creator: true,
        });
    };

    return (
        <SafeAreaView
            style={styles.container}
            // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.headers}>
                <Header
                    title={creator ? 'Quiz Creator' : 'Quiz Edit'}
                    style={styles.header}
                    navigation={navigation}
                    direct="Home"
                    options={() => {
                        setSaveQuizModal(!saveQuizModal);
                    }}
                    creator={creator}
                    quiz={quiz}
                />
            </View>
            <View style={styles.mainContent}>
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 15,
                        width: '80%',
                        height: '140%',
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Add Cover Image Quiz*/}
                    {/* <CoverImage backgroundImage={backgroundImage} /> */}
                    <ImageUpload
                        picture={backgroundImage}
                        setFile={setFile}
                        creator={true}
                    />

                    <View style={styles.settings}>
                        <TouchableOpacity
                            onPress={() =>
                                setIsPublicQuizModal(!isPublicQuizModal)
                            }
                            style={{ ...styles.settingBtn, width: '30%' }}
                        >
                            <MaterialIcons
                                name="public"
                                size={25}
                                color={colors.lightPurple}
                            />
                            <Text
                                style={{
                                    fontWeight: 700,
                                }}
                            >
                                {quizType}
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isPublicQuizModal}
                            onRequestClose={() => {
                                setIsPublicQuizModal(!isPublicQuizModal);
                            }}
                        >
                            <ModalQuiz
                                title="TypeQuiz"
                                arrayModal={typeQuiz}
                                stateModal={isPublicQuizModal}
                                setStateModal={setIsPublicQuizModal}
                                handleQuizChange={(isPublic) => {
                                    const bol =
                                        isPublic === 'Public' ? true : false;
                                    handleQuizChange(bol, 'isPublic');
                                }}
                                value={quizType}
                            />
                        </Modal>

                        <TouchableOpacity
                            onPress={() =>
                                setPointperQuestionModal(!pointperQuestionModal)
                            }
                            style={{ ...styles.settingBtn, width: '30%' }}
                        >
                            <MaterialIcons
                                name="public"
                                size={25}
                                color={colors.lightPurple}
                            />
                            <Text
                                style={{
                                    fontWeight: 700,
                                }}
                            >
                                {pointsPerQuestion} Point
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={pointperQuestionModal}
                            onRequestClose={() => {
                                setPointperQuestionModal(
                                    !pointperQuestionModal,
                                );
                            }}
                        >
                            <ModalQuiz
                                title="PointsPerQuestion"
                                arrayModal={PointsPer}
                                stateModal={pointperQuestionModal}
                                setStateModal={setPointperQuestionModal}
                                handleQuizChange={(point) =>
                                    handleQuizChange(point, 'pointsPerQuestion')
                                }
                                value={pointsPerQuestion}
                            />
                        </Modal>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={saveQuizModal}
                            onRequestClose={() => {
                                setSaveQuizModal(!saveQuizModal);
                            }}
                        >
                            <ModalNote
                                title="Save Quiz"
                                note="Hold on - Please save your quiz before
                                    continuing!"
                                stateModal={saveQuizModal}
                                setStateModal={setSaveQuizModal}
                                handlePress={() => handleSaveQuiz()}
                                // handleEditQuiz
                                showQuestionDetail={
                                    !importQuiz
                                        ? showQuestionDetail
                                        : showQuestionDetailImport
                                }
                                // showQuestionDetail={showQuestionDetail}
                                handleImportQuiz={handleImportQuiz}
                                loading={isLoading}
                                creator={creator}
                                importQuiz={importQuiz}
                            />
                        </Modal>
                    </View>

                    {/* Input Title */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            value={name ? name : ''}
                            style={styles.inputTitle}
                            placeholder="Enter quiz title"
                            onChangeText={(value) =>
                                handleQuizChange(value, 'name')
                            }
                        />
                    </View>

                    {/* Choose Category */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>Category</Text>
                        <TouchableOpacity
                            style={styles.chooseCategory}
                            onPress={() => {
                                setIsCategoriesModal(!isCategoriesModal);
                            }}
                        >
                            <View
                                style={{
                                    width: '120%',
                                    justifyContent: 'space-around',
                                    flexDirection: 'row',
                                    paddingHorizontal: 20,
                                    right: 30,
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'flex-start',
                                        width: '70%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'gray',
                                            fontSize: 18,
                                        }}
                                    >
                                        {tags}
                                        {!tags.length && 'Choose Categories'}
                                    </Text>
                                </View>
                                <View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        style={{ color: 'gray' }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={isCategoriesModal}
                        onRequestClose={() => {
                            setIsCategoriesModal(!isCategoriesModal);
                        }}
                    >
                        <ModalQuizArray
                            title="Categories"
                            arrayModal={categorieArary}
                            stateModal={isCategoriesModal}
                            setStateModal={setIsCategoriesModal}
                            handleQuizChange={(category) => {
                                if (!tags.includes(category)) {
                                    setQuizData({
                                        ...quizData,
                                        tags: [...quizData.tags, category],
                                    });
                                } else {
                                    setQuizData({
                                        ...quizData,
                                        tags: quizData.tags.filter(
                                            (item) => item !== category,
                                        ),
                                    });
                                }
                            }}
                            value={tags}
                        />
                    </Modal>

                    {/* Input Description */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>Description (optional)</Text>
                        <TextInput
                            value={description}
                            style={styles.inputDesc}
                            placeholder="Enter quiz description"
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(value) =>
                                handleQuizChange(value, 'description')
                            }
                        />
                    </View>
                </ScrollView>
            </View>
            <Toast />
        </SafeAreaView>
    );
};

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
        width: '90%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 35,
        marginTop: 25,
        padding: 15,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    label: {
        fontSize: 20,
        fontWeight: 600,
    },
    inputTitle: {
        marginTop: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 18,
    },
    inputDesc: {
        marginTop: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 18,
        height: '38%',
        paddingHorizontal: 20,
    },
    chooseCategory: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        fontSize: 18,
    },
    settings: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        width: '31%',
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
