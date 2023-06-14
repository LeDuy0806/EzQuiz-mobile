import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import {
    useRegisterMailOtpQuery,
    useVerifyOTPResetEmailMutation,
} from 'src/services/authApi';
import { useDispatch } from 'react-redux';
import { upDated } from 'src/slices/authSlice';
import Header from 'src/components/auth/Header';
import Button from 'src/components/auth/Button';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ResendOTP from 'src/components/auth/ResendOTP';
const InitOtp = { 1: '', 2: '', 3: '', 4: '' };

export default function SendEmailOTP({ navigation, ...props }) {
    const dispatch = useDispatch();

    const firstInput = useRef();
    const secondInput = useRef();
    const thirdInput = useRef();
    const fourthInput = useRef();
    const [OTP, setOTP] = useState(InitOtp);
    const [time, setTime] = useState(60);
    const [noClick, setNoClick] = useState(true);
    const [optValid, setOtpvalid] = useState(false);
    const timerId = useRef();

    const emailPrev = props.route.params.userEmail;
    const mail = props.route.params.infoEmail.userEmail;
    const username = props.route.params.infoEmail.userName;

    const OtpMail = props.route.params.infoEmail;
    useRegisterMailOtpQuery(OtpMail);

    const [verifyOTPMail, { data, isError, error, isLoading }] =
        useVerifyOTPResetEmailMutation();

    useEffect(() => {
        if (data) {
            dispatch(upDated(data));
            Toast.show({
                type: 'success',
                text1: 'Change Email',
                text2: 'Successffully !',
                visibilityTime: 2500,
                topOffset: 60,
            });
            setTimeout(() => {
                navigation.navigate('ChangeEmail');
            }, 2000);
        } else {
            const errorText = error?.data?.message;
            switch (errorText) {
                case 'Invalid OTP':
                    setOtpvalid(true);
                    break;
                default:
                    break;
            }
        }
    }, [data, isError]);

    useEffect(() => {
        timerId.current = setTimeout(() => {
            setTime((prev) => prev - 1);
        }, 1000);

        if (time === 0) {
            setOtpvalid(false);
            setNoClick(true);
        } else {
            setNoClick(false);
        }

        if (time === 0) {
            clearTimeout(timerId.current);
        }
    }, [time]);

    const setTimeStart = () => {
        setOtpvalid(false);
        setOTP(InitOtp);
        clearTimeout(timerId.current);
        setTime(60);
    };

    const handelSubmitOTP = () => {
        const OTPnumber = OTP[1] + OTP[2] + OTP[3] + OTP[4];
        if (!noClick) {
            verifyOTPMail({ emailPrev, newEmail: mail, code: OTPnumber });
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View styles={(width = '90%')}>
                <View style={styles.viewAll}>
                    <Header
                        title="OTP Vertification"
                        direct="ChangeEmail"
                        navigation={navigation}
                    />

                    <View style={styles.viewText}>
                        <Text>
                            We will send you a one time password on this
                        </Text>
                        <Text style={{ fontWeight: 700 }}>Email Address</Text>
                    </View>

                    <View style={styles.otpContainer}>
                        <View style={styles.otpBox}>
                            <TextInput
                                style={styles.otpText}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={firstInput}
                                onChangeText={(text) => {
                                    setOTP({ ...OTP, 1: text });
                                    // setOTP([...OTP  ,OTP[0]:text])
                                    setOtpvalid(false);
                                    text && secondInput.current.focus();
                                }}
                            />
                        </View>
                        <View style={styles.otpBox}>
                            <TextInput
                                style={styles.otpText}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={secondInput}
                                onChangeText={(text) => {
                                    setOTP({ ...OTP, 2: text });
                                    setOtpvalid(false);
                                    text && thirdInput.current.focus();
                                }}
                            />
                        </View>
                        <View style={styles.otpBox}>
                            <TextInput
                                style={styles.otpText}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={thirdInput}
                                onChangeText={(text) => {
                                    setOTP({ ...OTP, 3: text });
                                    setOtpvalid(false);
                                    text && fourthInput.current.focus();
                                }}
                            />
                        </View>
                        <View style={styles.otpBox}>
                            <TextInput
                                style={styles.otpText}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={fourthInput}
                                onChangeText={(text) => {
                                    setOTP({ ...OTP, 4: text });
                                    setOtpvalid(false);
                                }}
                            />
                        </View>
                    </View>

                    <Text style={{ marginTop: -20 }}>
                        {time === 60
                            ? '1:00'
                            : time >= 10
                            ? `0:${time}`
                            : `0:0${time}`}
                    </Text>
                    <ResendOTP
                        navigation={navigation}
                        userEmail={mail}
                        userName={username}
                        setTime={setTimeStart}
                    />

                    {optValid && (
                        <Text style={{ color: 'red' }}>OTP Invalid</Text>
                    )}

                    <Button
                        title="Submit"
                        navigation={navigation}
                        onPress={handelSubmitOTP}
                        click={noClick}
                        // loading={isLoading}
                    />
                </View>
            </View>
            <Toast />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: '#E3DFFD',
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
        gap: 20,
    },

    viewText: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    otpContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20,
    },

    otpBox: {
        borderRadius: 5,
        borderColor: '#865DFF',
        borderWidth: 0.5,
    },
    otpText: {
        fontSize: 25,
        color: '#0E122B',
        padding: 0,
        textAlign: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
    },

    viewSendOTP: {
        flexDirection: 'row',
    },

    textSendOTP: {
        color: '#865DFF',
        fontWeight: 700,
    },

    viewSubmit: {
        width: 100,
        backgroundColor: '#865DFF',
        height: 50,
    },
});
