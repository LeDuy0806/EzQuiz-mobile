import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';

// import { StackActions, NavigationActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';

import Header from 'src/components/auth/Header';
import Item from 'src/components/auth/Item';
import { logOut } from 'src/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
export default function Settings({ navigation }) {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auths?.user);
    const mail = userData?.mail;

    // const notiySuccessChangPassWord = () => {
    //     Toast.show({
    //         type: 'success',
    //         text1: 'Change PassWord',
    //         text2: 'Successffully !',
    //         visibilityTime: 2500,
    //         topOffset: 60,
    //     });
    // };

    const logout = () => {
        dispatch(logOut());
        navigation.navigate('Home');
        navigation.navigate('AuthNavigator');
    };

    const handlePassWord = () => {
        navigation.navigate('ChangePass', mail);
    };

    const handleChangeEmail = () => {
        navigation.navigate('ChangeEmail');
    };

    const EditProfile = () => {
        navigation.navigate('EditProfile');
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView
                style={{ width: '90%' }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.viewAll}>
                    <Header
                        title="Settings"
                        direct="Profile"
                        navigation={navigation}
                    />
                    <View style={styles.viewAccountAndOther}>
                        <Text style={styles.textAccount}>ACCOUNT</Text>
                        <Item
                            icon={
                                <Feather
                                    name="user"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            title="Update Profile"
                            text="Update username,country,etc"
                            onPress={EditProfile}
                        />

                        <Item
                            icon={
                                <MaterialCommunityIcons
                                    name="email-outline"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            title="Change Email Address"
                            text={mail}
                            onPress={handleChangeEmail}
                        />
                        <Item
                            icon={
                                <MaterialIcons
                                    name="lock-outline"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            title="Change Password"
                            text="Last change 1 year ago"
                            onPress={handlePassWord}
                        />
                    </View>

                    <View style={styles.viewAccountAndOther}>
                        <Text style={styles.textAccount}>OTHER</Text>
                        <View style={styles.viewNotification}>
                            <Text style={{ fontWeight: 900, fontSize: 16 }}>
                                Notification
                            </Text>
                            <Switch
                                style={{
                                    transform: [
                                        { scaleX: 1.2 },
                                        { scaleY: 1.2 },
                                    ],
                                }}
                            />
                        </View>

                        <Item
                            icon={
                                <MaterialCommunityIcons
                                    name="umbrella-beach-outline"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            title="Change Difficulty"
                            text="Easy, normal, hard"
                        />
                        <Item
                            icon={
                                <AntDesign
                                    name="question"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            title="FAQ"
                            text="Most frequently asked question"
                        />
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <View style={styles.viewLogout}>
                            <Text style={styles.textLogout}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Toast />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: '#fff',
        display: 'flex',
        width: '100%',
        height: '100%',
        gap: 10,
        alignItems: 'center',
    },
    viewAll: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    viewAccountAndOther: {
        marginTop: 20,
        width: '100%',
        flexDirection: 'column',
        gap: 20,
    },

    textAccount: {
        fontWeight: 700,
        color: 'gray',
    },

    viewOthers: {
        marginTop: 20,
        flexDirection: 'column',
    },
    viewNotification: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    viewLogout: {
        marginTop: 20,
    },

    textLogout: {
        color: '#FF8400',
        fontWeight: 700,
    },
});
