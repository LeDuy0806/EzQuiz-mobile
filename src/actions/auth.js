import * as api from '../api';
import { AUTH } from 'src/constants/actionTypes';

export const SignIn =
    (formData, navigation, handleLoading) => async (dispatch) => {
        try {
            const { data } = await api.login(formData);
            console.log(data);
            switch (data) {
                case 'All fields are mandatory!':
                    console.log('Vui long nhap day du thong tin');
                    break;
                case 'Account not exist':
                    console.log('Khong tim thay user');
                    break;
                case 'Wrong password':
                    console.log('Sai mat khau roi');
                    // handleLoading(true);
                    break;
                case 'Not Verify':
                    console.log('Vui long vao mail de xac nhan');
                    const letter = {
                        title: 'SignIn Falure!',
                        text: ' Please check your mail to verify-account',
                    };
                    setTimeout(() => {
                        navigation.navigate('LetterScreen', letter);
                    }, 1500);
                    break;
                default:
                    console.log('Dang Nhap thanh cong');
                    await handleLoading(true);
                    dispatch({ type: AUTH, data });
                    setTimeout(() => {
                        navigation.navigate('AppNavigator');
                        handleLoading(false);
                    }, 3000);

                    break;
            }
        } catch (error) {
            const { data } = await api.login(formData);
            console.log(error.message);
        }
    };

export const register = (formData, navigation) => async (dispatch) => {
    try {
        const { data } = await api.register(formData);
        console.log(data);

        switch (data) {
            case 'All fields are mandatory!':
                console.log('Vui long nhap day du thong tin');

                break;
            case 'UserName already exists':
                console.log('Ton tai userName roi thang ngu');

                break;
            case 'Email already exists':
                console.log('Ton tai email roi thang ngu');

                break;

            case 'Wrong email':
                console.log(
                    'Dang ky khong than cong , Vui long kiem tra lai thong tin',
                );
                break;

            default:
                const letter = {
                    title: 'Congratulations!',
                    text: 'SignUp Successfully! Please check your mail to verify-account',
                };
                setTimeout(() => {
                    navigation.navigate('LetterScreen', letter);
                }, 1500);
                break;
        }
    } catch (error) {
        console.log(error);
    }
};

export const generateOTP = (email, navigation) => async (dispatch) => {
    try {
        const { data } = await api.generateOTP({ params: { email } });
        switch (data) {
            case 'email Empty':
                console.log('Lam on nhap email');
                break;
            case 'email does not exists':
                console.log('EMAIL KHONG TON TAI THANG NGU');
                break;
            default:
                const text = `Your Password Recovery OTP is ${data.code}. Verify and recover your password`;
                setTimeout(() => {
                    navigation.navigate('SendOTP', email);
                }, 1500);
                await api.registerMail({
                    userName: data.userName,
                    userEmail: email,
                    text,
                    subject: 'Password Recovery OTP',
                });

                break;
        }
    } catch (error) {}
};

export const verifyOTP =
    ({ email, code }, navigation) =>
    async (dispatch) => {
        try {
            // const { data, status } = await api.verifyOTP({
            //     params: { email, code },
            // });
            // console.log(data, status);
            // return { data, status };
            const { data } = await api.verifyOTP({
                params: { email, code },
            });
            switch (data) {
                case 'Verify Successsfully!':
                    setTimeout(() => {
                        navigation.navigate('Newpass', email);
                    }, 1500);
                    break;
                case 'Invalid OTP':
                    console.log('Sai OTP roi thang ngu');
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log('Loi');
        }
    };

export const resetPassword =
    ({ email, password }, navigation) =>
    async (dispatch) => {
        try {
            const { data } = await api.resetPassWord({ email, password });
            switch (data) {
                case 'Change Password successfully!':
                    const letter = {
                        title: 'Successfully!',
                        text: 'Change Password Successfully! Now you can signIn with your new password',
                    };
                    setTimeout(() => {
                        navigation.navigate('LetterScreen', letter);
                    }, 1500);
                    break;
                default:
                    break;
            }
        } catch {
            console.log('Loii');
        }
    };
