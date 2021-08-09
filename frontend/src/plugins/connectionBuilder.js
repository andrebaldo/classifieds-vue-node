// frontend\src\plugins\connectionBuilder.js
// Author: Author : Andre Baldo (http://github.com/andrebaldo/) 
import axios from "axios";

let axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL,
});


const requestHandler = (request) => {
    if (typeof localStorage.loginToken !== 'undefined') {
        request.headers.common['Authorization'] = `Bearer ${localStorage.loginToken}`;
    } else {
        delete request.headers.common['Authorization'];
    }

    return request
}

axiosInstance.interceptors.request.use(
    request => requestHandler(request)
)

export default axiosInstance;
