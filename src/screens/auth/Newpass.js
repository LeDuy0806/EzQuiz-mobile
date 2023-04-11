import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { resetPassword } from 'src/actions/auth';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';
import FormTextInput from 'src/components/auth/Input';
import { MaterialIcons } from '@expo/vector-icons';

const Init = { newPass: '', confirmNewPass: '' };

export default function Newpass({ navigation, ...props }) {
    const [formData, setFormData] = useState(Init);
    const dispatch = useDispatch();

    const email = props.route.params;

    const handleChange = (e, name) => {
        setFormData({ ...formData, [name]: e.nativeEvent.text });
    };

    console.log(formData);

    const handleResetPassWord = () => {
        if (formData.newPass === formData.confirmNewPass) {
            let password = formData.newPass;
            console.log(password);
            dispatch(resetPassword({ email, password }, navigation));
        } else {
            console.log('Sai roi kia thang ng u');
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.viewAll}>
                <Header
                    title="Reset Password"
                    direct="SendOTP"
                    navigation={navigation}
                />

                <View style={styles.textNode}>
                    <Text style={{ fontSize: 16, color: 'gray' }}>
                        Your new password must be different from previous used
                        password
                    </Text>
                </View>

                <FormTextInput
                    lable="Password"
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

                <Button
                    title="Reset Password"
                    onPress={handleResetPassWord}
                    navigation={navigation}
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
