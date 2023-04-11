import axios from 'axios';

const BASE_URL = 'http://192.168.34.18:4000';
const USER_API = axios.create({ baseURL: `${BASE_URL}/api/user` });
export const getUserByEmail = (data) => USER_API.get(`/${data}`);
// export const getUserByEmail = (data) => USER_API.get('/email', data);

const AUTH_API = axios.create({ baseURL: `${BASE_URL}/api/auth` });

export const login = (formData) => AUTH_API.post('/login', formData);
export const register = (formData) => AUTH_API.post('/register', formData);
export const generateOTP = (data) => AUTH_API.get('/generateOTP', data);
export const verifyOTP = (data) => AUTH_API.get('/verifyOTP', data);
export const resetPassWord = (data) => AUTH_API.put('/resetPassword', data);

export const registerMail = (data) => AUTH_API.post('/registerMail', data);
