import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useChangeMailMutation } from 'src/services/authApi';
import { EmailReset } from 'src/validate/auth/Resgister';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';
import FormTextInput from 'src/components/auth/Input';

export default function ChangeEmail({ navigation }) {
    const [mail, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailFormatError, setEmailFormaError] = useState(false);
    const [noClick, setNoClick] = useState(true);

    // const userData = useSelector((state) => state.auths?.user);
    // const userName = userData?.data?.user?.userName;
    // const userEmail = userData?.data?.user?.mail;

    const userData = useSelector((state) => state.auths?.user);
    const userEmail = userData?.mail;
    const userName = userData?.useName;

    const [generateOTPMail, { data, isError, error, isLoading }] =
        useChangeMailMutation();

    useEffect(() => {
        if (!mail) {
            setNoClick(true);
        } else {
            setNoClick(false);
        }
    }, [mail]);

    useEffect(() => {
        if (data) {
            const infoEmail = {
                text: `Your Password Recovery OTP is ${data.code}. Verify and recover your password`,
                userName: data.userName,
                userEmail: mail,
                subject: 'Password Recovery OTP',
            };
            navigation.navigate('SendEmailOTP', { infoEmail, userEmail });
        }
        if (isError) {
            const errorText = error?.data;
            switch (errorText) {
                case 'Email have exist':
                    setEmailError(true);
                    setEmailFormaError(false);
                    break;
                default:
                    break;
            }
        }
    }, [data, isError]);

    const handleChange = (e, name) => {
        const value = e.nativeEvent.text;
        setEmail(value);
        setEmailError(false);
        EmailReset(value, setEmailFormaError);
    };

    const handleReset = () => {
        if (!noClick && !emailFormatError) {
            generateOTPMail({ mail, userName });
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.viewContainer}>
                <Header
                    title="Change Email"
                    direct="Settings"
                    navigation={navigation}
                />

                <View style={styles.viewTextInput}>
                    <Text style={{ fontSize: 16 }}>
                        Enter your email and we will send you a link to change
                        your email.
                    </Text>
                </View>

                <FormTextInput
                    lable="Email Address"
                    place="Your email address"
                    icon={
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={24}
                            color="#865DFF"
                        />
                    }
                    value={mail}
                    handleChange={(e) => handleChange(e, 'mail')}
                />
                {emailError && (
                    <Text style={{ color: 'red' }}>
                        Email have already exists
                    </Text>
                )}

                {emailFormatError && (
                    <Text style={{ color: 'red' }}>
                        Example:binbin18092003@gmail.com
                    </Text>
                )}

                <Button
                    title="Change Email"
                    // direct={'Newpass'}
                    onPress={handleReset}
                    navigation={navigation}
                    click={noClick}
                    loading={isLoading}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: '#E3DFFD',
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },

    viewContainer: {
        width: '90%',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    viewTextInput: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
});
