import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Entypo } from '@expo/vector-icons';
import { BoxUser, CategoryCard } from 'src/components';
import { categories } from 'src/constants/category.constant';
import { bgColors, colors } from 'src/styles/color';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import golebadge from 'src/assets/images/goldbadge.png';
import study from 'src/assets/images/study.png';

const DisplayDiscover = () => {
    const userInfo = useSelector((state) => state.auths?.user);
    const point = userInfo?.point;

    return (
        <View
            style={{ width: '100%', height: '100%' }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.fisrtSection}>
                {/* Top picks */}
                <View style={styles.boxTopPick}>
                    <View style={styles.boxTopPickLeft}>
                        <View style={styles.box}>
                            <Text
                                style={{ ...styles.textHeader, fontSize: 14 }}
                            >
                                TOP PICKS
                            </Text>
                        </View>

                        <View
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignSelf: 'baseline',
                            }}
                        >
                            <Text style={styles.textName}>
                                Travel Trivia Quiz
                            </Text>

                            <View style={styles.header}>
                                <MaterialCommunityIcons
                                    name="headphones"
                                    size={20}
                                    color="#660012"
                                />
                                <Text style={styles.textSub}>
                                    Math . 13 Quizzes
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Image
                            style={{ ...styles.image, width: 100, height: 100 }}
                            source={study}
                        />
                    </View>
                </View>
            </View>
            {/* <ScrollView> */}
            <View style={styles.mainContent}>
                <ScrollView
                    style={{ height: 100, marginBottom: 160 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flexGrow: 1 }}>
                        {/* <BoxUser number={true} normal={false} /> */}
                        <View style={styles.viewScore}>
                            <Entypo
                                name="graduation-cap"
                                size={30}
                                color="black"
                            />
                            <View style={{ width: '40%' }}>
                                <Text
                                    style={{ fontSize: 20, fontWeight: '800' }}
                                >
                                    Your Score
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: 20,
                                    }}
                                >
                                    {point} Point
                                </Text>
                                <Image
                                    style={styles.image}
                                    source={golebadge}
                                />
                            </View>
                        </View>

                        <Text style={[styles.textName, styles.textTitle]}>
                            Top categories of the week
                        </Text>

                        <View style={styles.categoryContain}>
                            {categories.map((category) => (
                                <CategoryCard
                                    noPress={true}
                                    width="46%"
                                    key={category.name}
                                    category={category}
                                    activeCategory={true}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
            {/* </ScrollView> */}
        </View>
    );
};

export default DisplayDiscover;

const styles = StyleSheet.create({
    fisrtSection: {
        paddingHorizontal: 20,
        width: '100%',
    },
    textHeader: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        alignItems: 'center',
    },
    boxTopPick: {
        width: '100%',
        height: 180,
        marginTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: '#FFE0E6',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    boxTopPickLeft: {
        height: '100%',
        gap: 20,
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 7,
    },
    box: {
        height: '30%',
        backgroundColor: colors.pink,
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        alignSelf: 'baseline',
    },
    textName: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: 17,
        color: '#660012',
        fontWeight: '900',
    },
    viewScore: {
        backgroundColor: colors.pink,
        height: '8%',
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    textSub: {
        fontSize: 12,
        color: '#660012',
        fontWeight: '500',
        alignItems: 'center',
        marginLeft: 6,
    },
    mainContent: {
        display: 'flex',
        width: '100%',
        backgroundColor: 'white',
        flex: 1,
        marginTop: 30,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 35,
        paddingBottom: 100,
    },
    textTitle: {
        fontSize: 20,
        color: 'black',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
    },
    categoryContain: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        gap: 20,
        marginBottom: 40,
    },
});
