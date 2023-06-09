import { StyleSheet } from 'react-native';

import { colors } from 'src/styles/color';

const styles = StyleSheet.create({
    userBox: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 8,
        borderRadius: 5,
    },
    avatarContainer: {
        position: 'relative',
        display: 'flex',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    name: {
        marginTop: 16,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    scoreContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        width: '75%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.lightPurple,
        borderRadius: 16,
    },
    score: {
        color: '#fff',
        fontWeight: 'bold',
    },
    badgeContainer: {
        position: 'absolute',
        zIndex: 1,
        width: 40,
        height: 40,
        bottom: 50,
        borderRadius: 20,
    },
    badge: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
});

export default styles;
