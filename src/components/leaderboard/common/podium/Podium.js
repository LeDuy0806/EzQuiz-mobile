// Libraries
import { View, Text } from 'react-native';

// Components, styles
import styles from './podium.style';
import UserBox from '../userbox/UserBox';

// Component cái bục đơn của rank 1, 2, 3
const SinglePodium = ({ rank, containerStyle, textStyle }) => (
    <View style={containerStyle}>
        <Text style={textStyle} numberOfLines={1}>
            {rank}
        </Text>
    </View>
);

const Podium = ({ firstUser, secondUser, thirdUser }) => {
    return (
        <View style={styles.container}>
            {/* Rank 2 */}
            <View
                style={{
                    flex: 1,
                }}
            >
                {secondUser ? (
                    <UserBox
                        avatar={secondUser.avatar}
                        name={secondUser.userName}
                        score={secondUser.point}
                        isSecondUser={true}
                    />
                ) : null}

                <SinglePodium
                    rank={2}
                    containerStyle={styles.secondPodiumContainer}
                    textStyle={styles.secondPodiumText}
                />
            </View>

            {/* Rank 1 */}
            <View
                style={{
                    flex: 1,
                }}
            >
                {firstUser ? (
                    <UserBox
                        avatar={firstUser.avatar}
                        name={firstUser.userName}
                        score={firstUser.point}
                        isFirstUser={true}
                    />
                ) : null}

                <SinglePodium
                    rank={1}
                    containerStyle={styles.firstPodiumContainer}
                    textStyle={styles.firstPodiumText}
                />
            </View>

            {/* Rank 3 */}
            <View
                style={{
                    flex: 1,
                }}
            >
                {thirdUser ? (
                    <UserBox
                        avatar={thirdUser.avatar}
                        name={thirdUser.userName}
                        score={thirdUser.point}
                        isThirdUser={true}
                    />
                ) : null}

                <SinglePodium
                    rank={3}
                    containerStyle={styles.thirdPodiumContainer}
                    textStyle={styles.thirdPodiumText}
                />
            </View>
        </View>
    );
};

export default Podium;
