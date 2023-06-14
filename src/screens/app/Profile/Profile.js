import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { StackActions, NavigationActions } from 'react-navigation';

import { useSelector } from 'react-redux';
import SubLayout from 'src/layouts/SubLayout';
import { BarChart } from 'react-native-chart-kit';

import { colors } from 'src/styles/color';
import ProfileNavigator from 'src/navigation/ProfileNavigator';

import { PieChartCompo, BarChartCompo } from 'src/components/PieChart';

export default function Profile({ navigation }) {
    const userInfo = useSelector((state) => state.auths?.user);
    const userName = userInfo?.userName;
    const avatar = userInfo?.avatar;
    const point = userInfo?.point;
    const follow = userInfo?.follow;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Home');
                            }}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={28}
                                color="white"
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Settings');
                        }}
                    >
                        <Ionicons
                            name="settings-sharp"
                            size={28}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                {/* Main */}
                <View style={styles.mainSection}>
                    <View style={{ zIndex: 1 }}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: avatar
                                    ? avatar
                                    : 'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-cute.jpg?ssl\u003d1',
                            }}
                        />
                    </View>
                    <View style={styles.displayContent}>
                        <SubLayout>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    paddingTop: 30,
                                    alignItems: 'center',
                                }}
                            >
                                {/* Name */}
                                <Text style={styles.textHeader}>
                                    {userName}
                                </Text>
                                {/* achievement */}
                                <View style={styles.achieveBox}>
                                    <View style={styles.box}>
                                        <Ionicons
                                            name="md-star-outline"
                                            size={24}
                                            color="white"
                                        />
                                        <Text style={styles.title}>POINTS</Text>
                                        <Text style={styles.score}>
                                            {point && point}
                                        </Text>
                                    </View>
                                    <View style={styles.box}>
                                        <Fontisto
                                            name="world-o"
                                            size={24}
                                            color="white"
                                        />
                                        <Text style={styles.title}>
                                            YOUR RANK
                                        </Text>
                                        <Text style={styles.score}>#1500</Text>
                                    </View>
                                    <View style={styles.box}>
                                        <Ionicons
                                            name="person-outline"
                                            size={24}
                                            color="white"
                                        />
                                        <Text style={styles.title}>
                                            Following
                                        </Text>
                                        <Text style={styles.score}>
                                            {follow && follow.length}
                                        </Text>
                                    </View>
                                </View>

                                {/* navigation */}
                                {/* <View
                                    style={{
                                        width: '100%',
                                        flexGrow: 1,
                                    }}
                                >
                                    <ProfileNavigator />
                                </View> */}
                                <View style={{ marginTop: 40 }}>
                                    <BarChartCompo />
                                </View>
                                <View style={{ marginTop: 40 }}>
                                    <PieChartCompo />
                                </View>
                            </View>
                        </SubLayout>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: 50,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    mainSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: 30,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'contain',
    },
    displayContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
        top: -36,
        bottom: 0,
    },
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    achieveBox: {
        height: 110,
        borderRadius: 20,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    box: {
        flex: 1,
        margin: 4,
        height: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: '#B2AAEE',
    },
    score: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
});
