// Libraries
import { View } from 'react-native';

// Components, styles
import styles from './weekly.style';
import UserCard from '../../common/usercard/UserCard';

const Weekly = ({ leaderBoard }) => {
    return (
        <View style={styles.container}>
            {leaderBoard &&
                leaderBoard?.map((user, index) => (
                    <UserCard key={index} index={index} user={user} />
                ))}
        </View>
    );
};

export default Weekly;
