import React, { useState, useRef } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { verifyOTP } from 'src/actions/auth';

import Header from 'src/components/auth/Header';
import Button from 'src/components/auth/Button';

export default function SendOTP({ navigation, ...props }) {
    const firstInput = useRef();
    const secondInput = useRef();
    const thirdInput = useRef();
    const fourthInput = useRef();
    const [OTP, setOTP] = useState({ 1: '', 2: '', 3: '', 4: '' });
    console.log(OTP);
    const dispatch = useDispatch();

    const email = props.route.params;
    console.log(email);

    const handelSubmitOTP = () => {
        const OTPnumber = OTP[1] + OTP[2] + OTP[3] + OTP[4];
        dispatch(verifyOTP({ email, code: OTPnumber }, navigation));
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View styles={(width = '90%')}>
                <View style={styles.viewAll}>
                    <Header
                        title="OTP Vertification"
                        direct="Reset"
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
                                    text
                                        ? thirdInput.current.focus()
                                        : firstInput.current.focus();
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
                                    text
                                        ? fourthInput.current.focus()
                                        : secondInput.current.focus();
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
                                    !text && thirdInput.current.focus();
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.viewSendOTP}>
                        <Text>Do not send OTP ? </Text>
                        <TouchableOpacity>
                            <Text style={styles.textSendOTP}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Submit"
                        navigation={navigation}
                        onPress={handelSubmitOTP}
                    />
                </View>
            </View>
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
