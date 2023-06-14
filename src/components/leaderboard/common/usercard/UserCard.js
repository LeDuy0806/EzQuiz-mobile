// Libraries
import { View, Text, Image, TouchableOpacity } from 'react-native';

// Styles, constants
import styles from './usercard.style';
import images from 'src/constants/images';

// Component huy hiệu
const Badge = ({ badge }) => (
    <View style={styles.badgeContainer}>
        <Image source={badge} style={styles.badge} resizeMode="contain" />
    </View>
);

const UserCard = ({ user, index }) => {
    // Function check URL của hình ảnh có hợp lệ hay ko
    const checkImageURL = (url) => {
        if (!url) return false;
        else {
            const pattern = new RegExp(
                '^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)$',
                'i',
            );
            return pattern.test(url);
        }
    };

    const displayBadge = () => {
        switch (index) {
            case 0:
                return <Badge badge={images.goldBadge} />;
            case 1:
                return <Badge badge={images.silverBadge} />;
            case 2:
                return <Badge badge={images.bronzeBadge} />;
            default:
                break;
        }
    };

    // Function xử lý: bấm vào 1 UserCard để hiện cửa sổ nhỏ chứa 1 số
    // thông tin của người dùng đó (có thể có hoặc bỏ đi)
    const handleShowInformation = () => {};

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleShowInformation}
        >
            <View style={styles.rankContainer}>
                <Text style={styles.rank}>{index + 1}</Text>
            </View>

            <View style={styles.avatarContainer}>
                <Image
                    resizeMode="contain"
                    style={styles.avatar}
                    source={
                        checkImageURL(user.avatar)
                            ? { uri: user.avatar }
                            : images.defaultAvatar
                    }
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {user.userName}
                </Text>
                <Text style={styles.score} numberOfLines={1}>
                    {user.point} points
                </Text>
            </View>

            {index < 3 && displayBadge()}
        </TouchableOpacity>
    );
};

export default UserCard;
