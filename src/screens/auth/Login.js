import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { SignIn } from 'src/actions/auth';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import google from 'src/assets/images/google.png';

import Divider from 'react-native-divider';

import Header from 'src/components/auth/Header';
import Button from 'src/components/auth/Button';
import FormTextInput from 'src/components/auth/Input';

const InitLogin = { userName: '', password: '' };

export default function Login({ navigation }) {
    const [loadDing, SetLoaDing] = useState(false);
    const [formData, setFormData] = useState(InitLogin);
    const dispatch = useDispatch();

    const handleChange = (e, name) => {
        setFormData({ ...formData, [name]: e.nativeEvent.text });
    };

    const handleLoading = (value) => {
        SetLoaDing(value);
    };

    // const handleLogin = () => {
    //     dispatch(SignIn(formData, navigation, handleLoading));
    // };

    return loadDing ? (
        <View style={styles.viewLoading}>
            <ActivityIndicator size="large" color="#865DFF" />
        </View>
    ) : (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView
                style={{ width: '90%' }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.viewAll}>
                    <Header
                        title="Login"
                        direct="Onboard"
                        navigation={navigation}
                    />
                    <View style={styles.formSignUp}>
                        <FormTextInput
                            lable="UserName"
                            place="User Name"
                            icon={
                                <Feather
                                    name="user"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            value={formData.userName}
                            handleChange={(e) => handleChange(e, 'userName')}
                        />
                        <FormTextInput
                            lable="Password"
                            place="Your Password"
                            icon={
                                <MaterialIcons
                                    name="lock-outline"
                                    size={24}
                                    color="#865DFF"
                                />
                            }
                            value={formData.password}
                            handleChange={(e) => handleChange(e, 'password')}
                        />

                        <View style={styles.viewFormfooter}>
                            <Button
                                title="Login"
                                navigation={navigation}
                                // onPress={handleLogin}
                                onPress={() =>
                                    navigation.navigate('AppNavigator')
                                }
                            />

                            <View style={styles.viewForgot}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Reset')}
                                >
                                    <Text style={styles.textForgot}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.viewNote}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textNoteGray}>
                                        By continuing, you agree to the
                                    </Text>
                                    <Text style={styles.textNoteBlack}>
                                        Term of Services
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textNoteGray}>&</Text>
                                    <Text style={styles.textNoteBlack}>
                                        Privcacy Policy
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Divider
                        borderColor="gray"
                        color="gray"
                        orientation="center"
                    >
                        OR
                    </Divider>

                    <View style={styles.viewLoginAnother}>
                        <TouchableOpacity>
                            <View style={styles.viewLoginwithFB}>
                                <MaterialCommunityIcons
                                    name="facebook"
                                    size={24}
                                    color="white"
                                />

                                <Text style={styles.textFB}>
                                    Login with Facebook
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={styles.viewLoginwithGG}>
                                <Image source={google} />

                                <Text style={styles.textGG}>
                                    Login with Google
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    viewLoading: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

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
    },
    formSignUp: {
        flexDirection: 'column',
        marginTop: 20,
        gap: 20,
    },

    viewFormfooter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },

    viewForgot: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textForgot: {
        color: '#865DFF',
        fontWeight: 700,
    },

    viewNote: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textNoteGray: {
        fontSize: 14,
        color: 'gray',
    },

    textNoteBlack: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },

    viewLoginAnother: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        gap: 20,
    },

    viewLoginwithFB: {
        backgroundColor: '#2F58CD',
        width: 310,
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },

    textFB: {
        color: 'white',
        fontWeight: 800,
    },

    viewLoginwithGG: {
        backgroundColor: 'white',
        width: 310,
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },

    textGG: {
        color: 'black',
        fontWeight: 800,
    },
});
