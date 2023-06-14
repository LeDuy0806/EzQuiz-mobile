// Libraries
import { View } from 'react-native';

// Components, styles
import styles from './alltime.style';
import Podium from '../../common/podium/Podium';
import UserCard from '../../common/usercard/UserCard';

const AllTime = ({ leaderBoard }) => {
    return (
        <View style={styles.container}>
            <Podium
                firstUser={leaderBoard[0]}
                secondUser={leaderBoard[1]}
                thirdUser={leaderBoard[2]}
            />

            <View style={styles.userCardContainer}>
                {leaderBoard?.slice(3)?.map((user, index) => (
                    <UserCard key={index} index={index + 3} user={user} />
                ))}
            </View>
        </View>
    );
};

export default AllTime;
