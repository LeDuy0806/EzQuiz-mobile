import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { RegisterValid } from 'src/validate/auth/Resgister';
import { useRegisterUserMutation } from 'src/services/authApi';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';
import FormTextInput from 'src/components/auth/Input';
import RadioButton from 'src/components/auth/RadioButton';

const InitRegister = {
    firstName: '',
    lastName: '',
    userType: '',
    userName: '',
    mail: '',
    password: '',
    fullName: '',
    confirmPassword: '',
};

const InitUserType = { Teacher: false, Student: false };

const InitErrorExist = {
    userName: false,
    mail: false,
};

const InitErrorUser = {
    userNameError: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
    requestQuantity: false,
    textQuantity: false,
};

export default function Register({ navigation }) {
    const [formData, setFormData] = useState(InitRegister);
    const [formError, setFormError] = useState(InitErrorExist);
    const [errorUser, setErrorUser] = useState(InitErrorUser);
    const [type, setType] = useState(InitUserType);
    const [noClick, setNoClick] = useState(true);

    const [registerUser, { data, isError, error, isLoading }] =
        useRegisterUserMutation();

    const {
        userNameError,
        emailError,
        passwordError,
        confirmPasswordError,
        textQuantity,
    } = errorUser;

    useEffect(() => {
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.userType ||
            !formData.userName ||
            !formData.mail ||
            !formData.password ||
            !formData.confirmPassword ||
            userNameError ||
            emailError ||
            passwordError ||
            confirmPasswordError
        ) {
            setNoClick(true);
        } else {
            setNoClick(false);
        }
    }, [formData]);

    useEffect(() => {
        if (data) {
            const letter = {
                title: 'Congratulations!',
                text: 'SignUp Successfully! Please check your mail to verify-account',
            };
            navigation.navigate('LetterScreen', letter);
        }
        if (isError) {
            const errorText = error?.data;
            switch (errorText) {
                case 'All fields are mandatory!':
                    console.log('Vui long nhap day du thong tin');
                    break;
                case 'Wrong email':
                    console.log('Email k dung');
                    break;
                case 'UserName already exists':
                    setFormError((pre) => {
                        var newError = { ...pre, userName: true };
                        return newError;
                    });
                    break;
                case 'Email already exists':
                    setFormError((pre) => {
                        var newError = { ...pre, mail: true };
                        return newError;
                    });
                    break;
                default:
                    break;
            }
        }
    }, [data, isError]);

    const handleChange = (e, name) => {
        const value = e.nativeEvent.text;
        setFormData({
            ...formData,
            [name]: value,
            fullName: formData.firstName + formData.lastName,
        });
        setFormError({ ...formError, [name]: false });
        RegisterValid(name, value, formData, setErrorUser);
    };

    const handleType = (name) => {
        setType((pre) => {
            var newType = { ...InitUserType, [name]: true };
            return newType;
        });
        setFormData({ ...formData, userType: name });
    };

    const handleRegister = () => {
        if (!noClick) {
            registerUser(formData);
        }
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

                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 40,
                                    alignItems: 'center',
                                }}
                            >
                                <Text>UserType:</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 50,
                                        alignItems: 'center',
                                    }}
                                >
                                    <RadioButton
                                        lable="Teacher"
                                        isSelect={type.Teacher}
                                        onPress={() => handleType('Teacher')}
                                    />
                                    <RadioButton
                                        lable="Student"
                                        isSelect={type.Student}
                                        onPress={() => handleType('Student')}
                                    />
                                </View>
                            </View>

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
                            {formError.userName && (
                                <Text style={{ color: 'red' }}>
                                    UserName already exist!
                                </Text>
                            )}
                            {userNameError && (
                                <Text style={{ color: 'red' }}>
                                    {textQuantity}
                                </Text>
                            )}

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
                                value={formData.mail}
                                handleChange={(e) => handleChange(e, 'mail')}
                            />
                            {formError.mail && (
                                <Text style={{ color: 'red' }}>
                                    Email already exist!
                                </Text>
                            )}

                            {emailError && (
                                <Text style={{ color: 'red' }}>
                                    Example: anhquoc1809@gmail.com
                                </Text>
                            )}

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
                            {passwordError && (
                                <Text style={{ color: 'red' }}>
                                    (upper,lower,special,number,atleast 8)
                                </Text>
                            )}
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
                            {confirmPasswordError && (
                                <Text style={{ color: 'red' }}>
                                    Wrong confirmPassword
                                </Text>
                            )}
                        </View>
                        <View style={{ marginTop: 30, width: '100%' }}>
                            <Button
                                title={'Register'}
                                onPress={handleRegister}
                                navigation={navigation}
                                click={noClick}
                                loading={isLoading}
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
