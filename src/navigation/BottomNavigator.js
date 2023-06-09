//library
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Path } from 'react-native-svg';
import { StyleSheet } from 'react-native';

//redux
import { useSelector } from 'react-redux';

//icons
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

//Screen
import Home from 'src/screens/app/Home/Home';
import Discover from 'src/screens/app/Discover/Discover';
import LeaderBoard from 'src/screens/app/LeaderBoard/LeaderBoard';
import Profile from 'src/screens/app/Profile/Profile';
import Community from 'src/screens/app/Community/Community';
import CommunityDetais from 'src/screens/app/Community/CommunityDetais';
import ShareQuiz from 'src/screens/app/Community/ShareQuiz';
import JoinGame from 'src/screens/app/PlayQuiz/JoinGame';
import AddQuestion from 'src/screens/app/Creator/AddQuestion';
import Creator from 'src/screens/app/Creator/Creator';

const Tab = createBottomTabNavigator();

export default function BottomNavigator({ navigation }) {
    const userInfo = useSelector((state) => state.auths?.user);
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case 'Home':
                            return (
                                <View>
                                    <Entypo
                                        name="home"
                                        size={focused ? 28 : 24}
                                        color={focused ? '#865DFF' : 'gray'}
                                    />
                                    <Path
                                        fill="#604AE6"
                                        d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
                                    />
                                </View>
                            );

                        case 'Discover':
                            return (
                                <View>
                                    <Entypo
                                        name="magnifying-glass"
                                        size={focused ? 28 : 24}
                                        color={focused ? '#865DFF' : 'gray'}
                                    />
                                </View>
                            );

                        case 'Creator':
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Creator', {
                                            quiz: '',
                                            creator: true,
                                            fresh: true,
                                        });
                                    }}
                                >
                                    <View style={styles.viewCreator}>
                                        <Ionicons
                                            name="add"
                                            size={focused ? 28 : 24}
                                            color="white"
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        case 'JoinGame':
                            return (
                                <View style={styles.viewCreator}>
                                    <FontAwesome
                                        name="th-large"
                                        size={focused ? 28 : 24}
                                        color="white"
                                    />
                                </View>
                            );

                        case 'LeaderBoard':
                            return (
                                <View>
                                    <MaterialIcons
                                        name="leaderboard"
                                        size={focused ? 28 : 24}
                                        color={focused ? '#865DFF' : 'gray'}
                                    />
                                </View>
                            );

                        case 'Community':
                            return (
                                <View>
                                    <Ionicons
                                        name="library-outline"
                                        size={focused ? 28 : 24}
                                        color={focused ? '#865DFF' : 'gray'}
                                    />
                                </View>
                            );

                        default:
                            break;
                    }
                },
                tabBarStyle: {
                    position: 'absolute',
                    height: '10%',
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Discover" component={Discover} />
            {userInfo?.userType === 'Teacher' ? (
                <Tab.Screen
                    name="Creator"
                    component={Creator}
                    options={{ tabBarStyle: { display: 'none' } }}
                />
            ) : (
                <Tab.Screen
                    name="JoinGame"
                    component={JoinGame}
                    options={{ tabBarStyle: { display: 'none' } }}
                />
            )}
            <Tab.Screen
                name="LeaderBoard"
                component={LeaderBoard}
                options={{ tabBarStyle: { display: 'none' } }}
            />
            <Tab.Screen
                name="Community"
                component={Community}
                options={{ tabBarStyle: { display: 'none' } }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={() => ({
                    tabBarStyle: {
                        display: 'none',
                    },
                    tabBarButton: () => null,
                })}
            />
            <Tab.Screen
                name="AddQuestion"
                component={AddQuestion}
                options={() => ({
                    tabBarStyle: {
                        display: 'none',
                    },
                    tabBarButton: () => null,
                })}
            />
            <Tab.Screen
                name="ShareQuiz"
                component={ShareQuiz}
                options={() => ({
                    tabBarStyle: {
                        display: 'none',
                    },
                    tabBarButton: () => null,
                })}
            />
            <Tab.Screen
                name="CommunityDetais"
                component={CommunityDetais}
                options={() => ({
                    tabBarStyle: {
                        display: 'none',
                    },
                    tabBarButton: () => null,
                })}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    viewCreator: {
        width: 60,
        height: 60,
        backgroundColor: '#865DFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginBottom: 70,
        shadowRadius: 20,
        shadowColor: 'red',
    },
});
