import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
} from 'react-native';

import Button from 'src/components/auth/Button';
import Header from 'src/components/auth/Header';
import FormTextInput from 'src/components/auth/Input';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LetterScreen({ navigation, ...props }) {
    const letter = props.route.params;
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.viewContainer}>
                <Header
                    title={letter.title}
                    direct="Login"
                    navigation={navigation}
                />

                <View style={styles.viewTextInput}>
                    <Text style={{ fontSize: 16 }}>{letter.text}</Text>
                </View>
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
