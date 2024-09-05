import axios from "axios";

// const isDev = process.env.NODE_PATH === 'development'
// const myAxios = axios.create({
//     baseURL: isDev ? 'http://localhost:8080/api' : '线上接口'
// });
// Set config defaults when creating the instance
const myAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ||'http://localhost:8080/api'
    // baseURL: '/api',  // 改为 '/api'，通过代理进行请求
});


myAxios.defaults.withCredentials = true//开启发送请求带着cookie

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log("我要发请求啦！！！",config);
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log("我收到相应啦！！！",response);
    //未登录重定向到登陆页面
    if(response?.data?.code === 40100  ){
        const redirectUrl   = window.location.href;
        window.location.href =` /user/login?redirect=${redirectUrl}`
    }
    // Do something with response data
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});


export default myAxios;



