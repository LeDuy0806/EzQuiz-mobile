import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { useRegisterUserMutation } from 'src/services/authApi';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';
import FormTextInput from 'src/components/auth/Input';

const InitRegister = {
    firstName: '',
    lastName: '',
    userType: '',
    userName: '',
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
};
export default function Register({ navigation }) {
    const [formData, seFormData] = useState(InitRegister);
    const dispatch = useDispatch();

    const [registerUser, { data, isError, error }] = useRegisterUserMutation();

    useEffect(() => {
        if (data) {
            const letter = {
                title: 'Congratulations!',
                text: 'SignUp Successfully! Please check your mail to verify-account',
            };
            setTimeout(() => {
                navigation.navigate('LetterScreen', letter);
            }, 1500);
        }
        if (isError) {
            const errorText = error?.data?.message;
            switch (errorText) {
                case 'All fields are mandatory!':
                    console.log('Vui long nhap day du thong tin');
                    break;
                case 'Wrong email':
                    console.log('Email k dung');
                    break;
                case 'UserName already exists':
                    console.log('Ton tai userName roi thang ngu');
                    break;
                case 'Email already exists':
                    console.log('Ton tai email roi thang ngu');
                    break;
                default:
                    break;
            }
        }
    }, [data, isError]);

    const handleChange = (e, name) => {
        seFormData({
            ...formData,
            [name]: e.nativeEvent.text,
            fullName: formData.firstName + formData.lastName,
        });
    };

    const handleRegister = () => {
        registerUser(formData);
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.viewContainer}>
                    <Header
                        title="Register"
                        direct="Onboard"
                        navigation={navigation}
                    />

                    <View
                        style={{
                            marginTop: 30,
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.formItem}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View style={styles.viewItem}>
                                    <View style={styles.viewTextSmall}>
                                        <Feather
                                            name="user"
                                            size={24}
                                            color="#865DFF"
                                        />
                                        <TextInput
                                            style={{ width: '60%' }}
                                            placeholder="FirstName"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                handleChange(e, 'firstName')
                                            }
                                        />
                                    </View>
                                </View>
                                <View style={styles.viewItem}>
                                    <View style={styles.viewTextSmall}>
                                        <Feather
                                            name="user"
                                            size={24}
                                            color="#865DFF"
                                        />
                                        <TextInput
                                            style={{ width: '60%' }}
                                            placeholder="LastName"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                handleChange(e, 'lastName')
                                            }
                                        />
                                    </View>
                                </View>
                            </View>

                            <FormTextInput
                                lable="UserType"
                                place="UserType"
                                icon={
                                    <Ionicons
                                        name="ios-options"
                                        size={24}
                                        color="#865DFF"
                                    />
                                }
                                value={formData.userType}
                                handleChange={(e) =>
                                    handleChange(e, 'userType')
                                }
                            />

                            <FormTextInput
                                lable="UserName"
                                place="UserName"
                                icon={
                                    <Feather
                                        name="user"
                                        size={24}
                                        color="#865DFF"
                                    />
                                }
                                value={formData.userName}
                                handleChange={(e) =>
                                    handleChange(e, 'userName')
                                }
                            />

                            <FormTextInput
                                lable="Email"
                                place="Your Email"
                                icon={
                                    <MaterialCommunityIcons
                                        name="email-outline"
                                        size={24}
                                        color="#865DFF"
                                    />
                                }
                                value={formData.email}
                                handleChange={(e) => handleChange(e, 'email')}
                            />

                            <FormTextInput
                                lable="Password"
                                place="Confirm Password"
                                icon={
                                    <MaterialIcons
                                        name="lock-outline"
                                        size={24}
                                        color="#865DFF"
                                    />
                                }
                                value={formData.password}
                                handleChange={(e) =>
                                    handleChange(e, 'password')
                                }
                            />
                            <FormTextInput
                                lable="Confirm Password"
                                place="Your Password"
                                icon={
                                    <MaterialIcons
                                        name="lock-outline"
                                        size={24}
                                        color="#865DFF"
                                    />
                                }
                                value={formData.confirmPassword}
                                handleChange={(e) =>
                                    handleChange(e, 'confirmPassword')
                                }
                            />

                            <Button
                                title={'Register'}
                                onPress={handleRegister}
                                navigation={navigation}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: '#E3DFFD',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    viewContainer: {
        width: '90%',
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    formItem: {
        flexDirection: 'column',
        gap: 20,
    },

    viewTextSmall: {
        width: 140,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});
