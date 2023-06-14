import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import { useResetPassMutation } from 'src/services/authApi';
import { RequirePassword } from 'src/validate/auth/Resgister';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';

import FormTextInput from 'src/components/auth/Input';
import { MaterialIcons } from '@expo/vector-icons';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { upDated } from 'src/slices/authSlice';
import { useDispatch } from 'react-redux';

const Init = { newPass: '', confirmNewPass: '' };

export default function ChangePass({ navigation, ...props }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(Init);
    const [requirePasswordError, setRequirePasswordError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [noClick, setNoClick] = useState(true);

    const mail = props.route.params;

    const handleChange = (e, name) => {
        const value = e.nativeEvent.text;
        setConfirmError(false);
        setFormData({ ...formData, [name]: value });
        if (name === 'newPass') {
            RequirePassword(value, setRequirePasswordError);
        }
    };

    const [newPass, { data, isError, isLoading, error }] =
        useResetPassMutation();

    useEffect(() => {
        if (
            !formData.newPass ||
            !formData.confirmNewPass ||
            requirePasswordError
        ) {
            setNoClick(true);
        } else {
            setNoClick(false);
        }
    }, [formData]);

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
        }
        if (isError) {
            console.log(error);
            setConfirmError(true);
        }
    }, [data, isError]);

    const handleResetPassWord = () => {
        newPass({
            mail,
            password: formData.newPass,
            confirm: formData.confirmNewPass,
        });
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.viewAll}>
                <Header
                    title="Change Password"
                    direct="Settings"
                    navigation={navigation}
                />

                <View style={styles.textNode}>
                    <Text style={{ fontSize: 16, color: 'gray' }}>
                        Your new password must be different from previous used
                        password
                    </Text>
                </View>

                <FormTextInput
                    lable="New Password"
                    place="New Password"
                    icon={
                        <MaterialIcons
                            name="lock-outline"
                            size={24}
                            color="#865DFF"
                        />
                    }
                    value={formData.newPass}
                    handleChange={(e) => handleChange(e, 'newPass')}
                />
                {requirePasswordError && (
                    <Text style={{ color: 'red' }}>
                        (upper,lower,special,number,atleast 8)
                    </Text>
                )}

                <FormTextInput
                    lable="Confirm Password"
                    place="Confirm Password"
                    icon={
                        <MaterialIcons
                            name="lock-outline"
                            size={24}
                            color="#865DFF"
                        />
                    }
                    value={formData.confirmNewPass}
                    handleChange={(e) => handleChange(e, 'confirmNewPass')}
                />

                {confirmError && (
                    <Text style={{ color: 'red' }}>
                        Confirm password Invalid
                    </Text>
                )}

                <Button
                    title="Change Password"
                    onPress={handleResetPassWord}
                    navigation={navigation}
                    click={noClick}
                    loading={isLoading}
                />
            </View>
            <Toast />
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

    viewAll: {
        width: '90%',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textNode: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
});
