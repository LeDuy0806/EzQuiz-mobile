import React from 'react';
import background from 'src/assets/images/background.png';
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import connect from 'src/assets/images/connect.png';
import Button from 'src/components/auth/Button';

export default function Onboard({ navigation }) {
    return (
        <SafeAreaView>
            <ImageBackground style={styles.backgroundImage} source={background}>
                <View style={styles.viewImage}>
                    <Image source={connect} />
                </View>

                <View style={styles.optionSign}>
                    <View style={styles.optionContainer}>
                        <Text style={styles.textTakenpart}>
                            Take part in challenges with friends
                        </Text>

                        <Button
                            title={'SignUp'}
                            onPress={() => navigation.navigate('Register')}
                            navigation={navigation}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Already have an account? </Text>
                            <TouchableOpacity
                                onPressIn={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.textLogin}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    viewImage: {
        marginTop: 100,
    },

    optionSign: {
        backgroundColor: 'white',
        width: '90%',
        height: '30%',
        borderRadius: 15,
    },

    optionContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    textTakenpart: {
        fontSize: 26,
        fontWeight: 800,
        textAlign: 'center',
    },

    textSignUp: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 600,
    },
    textLogin: {
        color: '#865DFF',
        fontWeight: 700,
    },
});
