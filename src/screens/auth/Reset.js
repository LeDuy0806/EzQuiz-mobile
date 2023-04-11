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
import { generateOTP } from 'src/actions/auth';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';
import FormTextInput from 'src/components/auth/Input';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Reset({ navigation }) {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(generateOTP(email, navigation));
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.viewContainer}>
                <Header
                    title="Reset Password"
                    direct="Login"
                    navigation={navigation}
                />

                <View style={styles.viewTextInput}>
                    <Text style={{ fontSize: 16 }}>
                        Enter your email and we will send you a link to reset
                        your password.
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
                    value={email}
                    handleChange={(e) => setEmail(e.nativeEvent.text)}
                />

                <Button
                    title="Reset Password"
                    // direct={'Newpass'}
                    onPress={handleReset}
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
