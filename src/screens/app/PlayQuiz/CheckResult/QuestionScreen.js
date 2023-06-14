import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Question from './Question';
import { AntDesign } from '@expo/vector-icons';

const screenWidth = Dimensions.get('screen').width;
export default function QuestionScreen({
    questionData,
    length,
    result,
    handleBack,
}) {
    const arrayCorrect = questionData.answerList.map((item) => {
        if (item.isCorrect === true) {
            return item.name;
        }
    });
    return (
        <View style={{ ...styles.container, width: screenWidth }}>
            <View style={styles.viewAll}>
                <TouchableOpacity onPress={handleBack} style={styles.viewBack}>
                    <AntDesign name="arrowleft" size={35} color="#fff" />
                </TouchableOpacity>
                <View style={styles.viewQuestionTitle}>
                    <Text style={styles.textSub}>
                        Question {questionData?.questionIndex} of {length}
                        {/* Question 1 of 3 */}
                    </Text>
                    <Text style={styles.textSub}>
                        {questionData?.optionQuestion} Choice
                        {/* Single Choice */}
                    </Text>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Text style={styles?.textTitle}>
                            {questionData?.question}
                        </Text>

                        <Image
                            source={{
                                uri: questionData?.backgroundImage
                                    ? questionData.backgroundImage
                                    : 'https://us.123rf.com/450wm/sn333g/sn333g1608/sn333g160800029/65791205-math-round-bright-symbol-vector-colorful-mathematics-school-subject-bright-sign-in-thin-line-style.jpg?ver=6',
                            }}
                            style={{
                                height: 70,
                                width: '40%',
                                resizeMode: 'cover',
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 40, width: '100%' }}>
                    <Question
                        questionData={questionData}
                        arrayCorrect={arrayCorrect}
                        result={result}
                        // host={host}
                        // onClick={onClick}
                        // isAnswerSelect={isAnswerSelect}
                        // Correct={
                        //     host
                        //         ? correctAnswer[questionData?.questionIndex - 1]
                        //         : ''
                        // }
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
    },

    viewAll: {
        width: '80%',
        height: '100%',
        gap: 50,
        // backgroundColor: 'red',
    },

    viewBack: {
        width: '20%',
        height: '10%',
        backgroundColor: '#FF8FA2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 15,
    },

    viewQuestionTitle: {
        width: '100%',
        height: '10%',
        justifyContent: 'center',
        alignContent: 'center',
    },

    textSub: {
        color: 'gray',
        fontSize: 14,
    },

    textTitle: {
        width: '40%',
        color: '#000',
        fontSize: 20,
        height: '100%',
    },

    viewQuestionAnswer: {
        width: '90%',
    },
});
