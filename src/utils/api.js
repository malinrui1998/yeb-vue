import Axios from "axios"
import router from '../router'
import {
	Message
} from 'element-ui';

// 请求拦截器
Axios.interceptors.request.use(config => {
	//如果存在token，请求携带这个token
	if (window.sessionStorage.getItem('tokenSrt')) {
		config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
	}
	return config
}, error => {
	console.log(error)
})


Axios.interceptors.response.use(success => {
	if (success.status && success.status == 200) {
		if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
			Message.error({
				message: success.data.message
			});
			return;
		}
		if (success.data.message) {
			Message.success({
				message: success.data.message
			});
		}
	}
	return success.data;
}, error => {
	if (error.response.code == 504 || error.response.code == 404) {
		Message.error({
			message: '服务器宕机了，( ╯□╰ )'
		});
	} else if (error.response.code == 403) {
		Message.error({
			message: '您的权限不足'
		});
	} else if (error.response.code == 401) {
		Message.error({
			message: '尚未登录，请登录'
		});
		//跳至登录页面
		router.replace('/');
	} else if (error.response.data.message) {
		Message.error({
			message: error.response.data.message
		})
	} else {
		Message.error({
			message: '未知错误'
		});
	}
	return;
})

let base = ''
export const postRequest = (url, params) => {
	return Axios({
		method: 'post',
		url: `${base}${url}`,
		data: params
	})
}
export const putRequest = (url, params) => {
	return Axios({
		method: 'put',
		url: `${base}${url}`,
		data: params
	})
}
export const getRequest = (url, params) => {
	return Axios({
		method: 'get',
		url: `${base}${url}`,
		data: params
	})
}
export const deleteRequest = (url, params) => {
	return Axios({
		method: 'delete',
		url: `${base}${url}`,
		data: params
	})
}
