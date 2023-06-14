import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Touchable,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
export default function Item({ navigation, ...props }) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.viewItem}>
                <View style={styles.viewIcon}>{props.icon}</View>

                <View style={styles.viewText}>
                    <Text style={{ fontWeight: 700, fontSize: 16 }}>
                        {props.title}
                    </Text>
                    <Text style={{ color: 'gray' }}>{props.text}</Text>
                </View>

                <TouchableOpacity onPress={props.onPress}>
                    <View style={styles.viewlastIcon}>
                        <AntDesign name="right" size={20} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    viewItem: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#E3DFFD',
        borderRadius: 20,
    },

    viewIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },

    viewText: {
        width: '62%',
    },

    viewlastIcon: {
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
