import axios from 'axios'
import {Message} from "element-ui";

//请求拦截器
axios.interceptors.request.use(config=>{
	if (window.sessionStorage.getItem('tokenStr')){
		//请求时自动带入token
		config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
	}
	return config;
},error => {
	console.log(error);
})

axios.interceptors.response.use(success=>{
	//业务逻辑错误
	if (success.status||success.data.code==200){
		if (success.data.code==500||success.data.code==401||success.data.code==403){
			Message.error({message:success.data.message});
			return;
		}
		if (success.data.message){
			Message.success({message:success.data.message})
		}
	}
	return success.data;
},error=>{
	//未能调取接口错误
	if (error.response.data.code==504||error.response.data.code==404){
		Message.error({message:'服务器被吃了'})
	}else if(error.response.data.code==403){
		Message.error({message:'权限不足'})
	}else if(error.response.data.code==401){
		Message.error({message:'尚未登陆'})
		router.replace('/')
	}
	else {

		if (error.response.data.message) {
			Message.error({message: error.response.data.message});
		} else {
			Message.error({message: '未知错误'})
		}
	}
	return;
});


let base='';

//传送json请求格式的post请求
export const postRequest=(url,params)=>{
	return axios({
		method:'post',
		url:`${base}${url}`,
		data:params
	})
}

export const putRequest=(url,params)=>{
	return axios({
		method:'put',
		url:`${base}${url}`,
		data:params
	})
}

export const getRequest=(url,params)=>{
	return axios({
		method:'get',
		url:`${base}${url}`,
		data:params
	})
}



export  const deleteRequest=(url,params)=>{
	return axios({
		method:'delete',
		url:`${base}${url}`,
		data:params
	})
}