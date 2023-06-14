import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';

export default function Button({ navigation, ...props }) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={[
                    styles.viewButon,
                    {
                        backgroundColor: props.click ? 'gray' : '#865DFF',
                        width: props.onboard ? '90%' : '96%',
                    },
                ]}
            >
                {props.loading ? (
                    <View style={styles.viewLoading}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <Text style={styles.textTitle}>{props.title}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    viewLoading: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButon: {
        width: '90%',
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
    },

    textTitle: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 600,
    },
});
