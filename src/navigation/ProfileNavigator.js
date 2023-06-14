import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CatogoriesFilter, QuizFilter } from 'src/components/discover';
import { colors } from 'src/styles/color';
import { AboutMe } from 'src/components';

const ProfileNavigator = () => {
    const ProfileStack = createMaterialTopTabNavigator();

    return (
        <ProfileStack.Navigator
            initialRouteName="Top"
            style={{
                display: 'flex',
                paddingTop: 20,
            }}
            screenOptions={{
                tabBarPressColor: 'transparent',
                tabBarStyle: {
                    marginBottom: 18,
                    shadowColor: 'transparent',
                },
                tabBarIndicator: () => <View></View>,
            }}
        >
            <ProfileStack.Screen
                name="QuizFilter"
                component={QuizFilter}
                options={{
                    title: ({ color, focused }) => (
                        <View style={styles.container}>
                            <View
                                style={{
                                    ...styles.indicator,
                                    backgroundColor: focused
                                        ? colors.second
                                        : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.text,
                                        color: focused ? '#333' : 'gray',
                                    }}
                                >
                                    Quizez
                                </Text>
                            </View>
                        </View>
                    ),
                }}
            />

            <ProfileStack.Screen
                name="CatogoriesFilter"
                component={CatogoriesFilter}
                options={{
                    title: ({ color, focused }) => (
                        <View style={styles.container}>
                            <View
                                style={{
                                    ...styles.indicator,
                                    backgroundColor: focused
                                        ? colors.second
                                        : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.text,
                                        color: focused ? 'white' : 'gray',
                                    }}
                                >
                                    Collections
                                </Text>
                            </View>
                        </View>
                    ),
                }}
            />

            <ProfileStack.Screen
                name="AboutMe"
                component={AboutMe}
                options={{
                    title: ({ color, focused }) => (
                        <View style={styles.container}>
                            <View
                                style={{
                                    ...styles.indicator,
                                    backgroundColor: focused
                                        ? colors.second
                                        : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.text,
                                        color: focused ? '#333' : 'gray',
                                    }}
                                >
                                    About
                                </Text>
                            </View>
                        </View>
                    ),
                }}
            />
        </ProfileStack.Navigator>
    );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 160,
        height: 35,
    },
    indicator: {
        width: '60%',
        height: '100%',
        borderRadius: 16,
        borderColor: colors.second,
        // borderWidth: 2,
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        justifyContent: 'center',
        fontWeight: '600',
        alignSelf: 'center',
    },
});
