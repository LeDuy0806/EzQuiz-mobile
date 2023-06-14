import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Header from 'src/components/auth/Header';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUpdateUserMutation } from 'src/services/userApi';
import { upDated } from 'src/slices/authSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function EditProfile({ navigation }) {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);

    const userInfo = useSelector((state) => state.auths?.user);
    const InitForm = {
        avatar: userInfo.avatar || null,
        userName: userInfo.userName,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        mail: userInfo.mail,
    };

    const [formEdit, setFormEdit] = useState(userInfo ? InitForm : null);

    const { avatar, firstName, lastName, userName, mail } = formEdit;
    const [save, setSave] = useState(true);

    useEffect(() => {
        if (
            !avatar ||
            !firstName ||
            !lastName ||
            !userName ||
            !mail ||
            (avatar === InitForm.avatar &&
                userName === InitForm.userName &&
                firstName === InitForm.firstName &&
                lastName === userInfo.lastName &&
                mail === userInfo.mail)
        ) {
            setSave(false);
        } else {
            setSave(true);
        }
    }, [formEdit]);

    const userData = useSelector((state) => state.auths?.authData);
    const accessToken = userData?.data?.accessToken;
    const userId = userData?.data?.user?._id;

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const handleChangeAva = () => {};

    const chooseImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            allowsMultipleSelection: false,
            aspect: [5, 4],
            quality: 1,
            base64: true,
        });
        if (pickerResult.canceled === true) {
            return;
        } else {
            let newFile = {
                uri: pickerResult.assets[0].uri,
                type: `test/${pickerResult.assets[0].uri.split('.')[1]}`,
                name: `test/${pickerResult.assets[0].uri.split('.')[1]}`,
            };
            uploadImage(newFile);
            setFormEdit({
                ...formData,
                avatar: `data:image/jpeg;base64,${pickerResult.assets[0].base64}`,
            });
        }
    };

    const uploadImage = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'imagequizapp');
        formData.append('cloud_name', 'dfl3qnj7z');
        fetch(`https://api.cloudinary.com/v1_1/dfl3qnj7z/image/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data?.secure_url);
                setFormEdit({
                    ...formEdit,
                    avatar: data?.secure_url,
                });
            })
            .catch((error) => console.error(error));
    };

    const handleChangeForm = (value, name) => {
        setFormEdit({ ...formEdit, [name]: value });
    };

    const handleEditProfile = async () => {
        if (save) {
            const { data } = await updateUser({
                accessToken,
                userId,
                updateUser: formEdit,
            });
            if (data) {
                dispatch(upDated(data));
                Toast.show({
                    type: 'success',
                    text1: 'Successfully !',
                    text2: 'Update successfully!',
                    visibilityTime: 2500,
                    topOffset: 60,
                });
            }
        }
    };

    return (
        <ScrollView
            style={styles.viewScrool}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.viewSafe}>
                <Header
                    title="EditProfile"
                    direct="Settings"
                    navigation={navigation}
                />
                <TouchableOpacity
                    style={styles.viewAvatar}
                    onPress={chooseImage}
                >
                    <Image
                        style={styles.image}
                        source={{
                            uri: avatar
                                ? avatar
                                : 'https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-cute.jpg?ssl\u003d1',
                        }}
                    />
                </TouchableOpacity>
                <View style={{ ...styles.viewInfo, gap: 20 }}>
                    <View style={styles.viewInfoLabelSmall}>
                        <Text style={styles.textInfoLabel}>firstName</Text>
                        <TextInput
                            style={styles.inputSmall}
                            value={firstName}
                            onChangeText={(value) =>
                                handleChangeForm(value, 'firstName')
                            }
                        />
                    </View>
                    <View style={styles.viewInfoLabelSmall}>
                        <Text style={styles.textInfoLabel}>lastName</Text>
                        <TextInput
                            style={styles.inputSmall}
                            value={lastName}
                            onChangeText={(value) =>
                                handleChangeForm(value, 'lastName')
                            }
                        />
                    </View>
                </View>
                <View style={styles.viewInfo}>
                    <View style={styles.viewInfoLabel}>
                        <Text style={styles.textInfoLabel}>UserName</Text>
                    </View>
                    <View style={styles.viewInfoInput}>
                        <TextInput
                            value={userName}
                            onChangeText={(value) =>
                                handleChangeForm(value, 'userName')
                            }
                        />
                    </View>
                </View>
                <View style={styles.viewInfo}>
                    <View style={styles.viewInfoLabel}>
                        <Text style={styles.textInfoLabel}>Email</Text>
                    </View>
                    <View style={styles.viewInfoInput}>
                        <TextInput
                            value={mail}
                            onChangeText={(value) =>
                                handleChangeForm(value, 'mail')
                            }
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        ...styles.viewUpdate,
                        backgroundColor: save ? 'red' : 'gray',
                    }}
                    activeOpacity={save ? 0 : 1}
                    onPress={handleEditProfile}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.textUpdate}>Update Profile</Text>
                    )}
                </TouchableOpacity>
                <Toast />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewScrool: {
        height: '100%',
        width: '100%',
        backgroundColor: '#E3DFFD',
        flex: 1,
    },
    viewSafe: {
        flex: 1,
        width: '100%',
        height: '120%',
        gap: 40,
        alignItems: 'center',
    },
    viewAvatar: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        paddingBottom: 100,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        resizeMode: 'cover',
    },
    viewUpdate: {
        width: '70%',
        height: '8%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUpdate: {
        color: '#fff',
        fontWeight: 700,
    },
    viewInfo: {
        height: '6%',
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewInfoLabel: {
        width: '30%',
    },
    viewInfoLabelSmall: {
        flexDirection: 'row',
        width: '50%',
        alignItems: 'center',
        gap: 10,
    },

    inputSmall: {
        backgroundColor: '#D8D8D8',
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },

    viewInfoInput: {
        width: '70%',
        backgroundColor: '#D8D8D8',
        height: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    textInfoLabel: {
        fontStyle: 'italic',
        fontWeight: '600',
    },
});
