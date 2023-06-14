// Library
import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//redux
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// Actions
import { changeActiveCategory } from 'src/slices/creatorSlice';

// Color
import { colors, bgColors } from 'src/styles/color';

const CategoryCard = ({
    category,
    activeCategory,
    width,
    showQuiz,
    creator,
    quizBest,
    noPress,
}) => {
    const dispatch = useDispatch();
    const [quality, setQuality] = useState();
    const [quizCate, setQuizCate] = useState([]);

    const quizes = useSelector((state) => state.quizs.allquizes);

    useEffect(() => {
        let lc = 0;
        let quizArray = [];
        quizes.map((quiz) => {
            if (quiz.tags.includes(category.name)) {
                lc++;
                quizArray.push(quiz);
            }
        });
        setQuality(lc);
        setQuizCate(quizArray);
    }, [quizes]);

    return (
        <TouchableOpacity
            style={{
                ...styles.container,
                backgroundColor: activeCategory
                    ? category.color
                    : bgColors.lightPurple,
                width: width,
            }}
            activeOpacity={noPress ? 1 : 0}
            onPress={() => {
                if (showQuiz) {
                    showQuiz(quizCate);
                }
            }}
        >
            <View
                style={{
                    backgroundColor: activeCategory ? category.color : '#fff',
                    padding: 10,
                    borderRadius: 20,
                }}
            >
                <MaterialCommunityIcons
                    name={category.icon}
                    size={30}
                    color={activeCategory ? '#fff' : '#000'}
                />
            </View>
            <Text
                style={{
                    ...styles.label,
                    color: activeCategory ? '#fff' : colors.lightPurple,
                }}
            >
                {category.name}
            </Text>
            {!creator && (
                <Text
                    style={{
                        ...styles.quizQuantity,
                        color: activeCategory ? '#fff' : colors.lightPurple,
                    }}
                >
                    {quality} Quizzes
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default CategoryCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColors.lightPurple,
        paddingVertical: 24,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    label: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 700,
    },
    quizQuantity: {
        marginTop: 8,
        fontSize: 12,
    },
});
