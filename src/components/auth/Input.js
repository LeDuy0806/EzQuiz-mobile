import React, { useEffect, useState } from 'react';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const checkIsPass = ['Password', 'Confirm Password'];

export default function FormTextInput(props) {
    const [showPass, setShowPass] = useState(false);

    return (
        <View style={styles.formItem}>
            <Text>{props.lable}</Text>
            <View style={styles.viewItem}>
                <View style={styles.viewTextInput}>
                    {props.icon}
                    <TextInput
                        style={{
                            width: checkIsPass.includes(props.lable)
                                ? '70%'
                                : '80%',
                        }}
                        placeholder={props.place}
                        secureTextEntry={
                            !showPass && checkIsPass.includes(props.lable)
                                ? true
                                : false
                        }
                        value={props.value}
                        onChange={props.handleChange}
                    />
                    {checkIsPass.includes(props.lable) && (
                        <TouchableOpacity
                            onPress={() => setShowPass(!showPass)}
                        >
                            <MaterialCommunityIcons
                                name={
                                    !showPass
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                }
                                size={24}
                                color="#865DFF"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formItem: {
        flexDirection: 'column',
        gap: 10,
    },
    viewItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewTextInput: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});
