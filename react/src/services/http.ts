/**
 * request.js
 * 通过promise对axios做二次封装，针对用户端参数，做灵活配置
 */
 import { message } from 'antd';

 import instance from './interceptor'
 
 /**
  * 核心函数，可通过它处理一切请求数据，并做横向扩展
  * @param {url} 请求地址
  * @param {params} 请求参数
  * @param {options} 请求配置，针对当前本次请求；
  * @param loading 是否显示loading
  * @param mock 本次是否请求mock而非线上
  * @param error 本次是否显示错误
  */
 function request(url: string,params: any,method: string): Promise<any> {
     let loadingInstance: { close: () => void; };
     // 请求前loading
    //  if(options.loading)loadingInstance=Loading.service();
     return new Promise((resolve,reject)=>{
         let data = {}
         // get请求使用params字段
         if(method =='get' || method =='delete') data = {params}
         // post请求使用data字段
         if(method =='post' || method == 'put') data = {data:JSON.stringify(params)}
         // 通过mock平台可对局部接口进行mock设置
        //  if(options.mock)url='http://www.mock.com/mock/xxxx/api';
         instance({
             url, //process?.env?.NODE_ENV === 'DEV' ? `api/${url}` : url,
             method,
             ...data
         }).then((res: any)=>{
            //  console.log(res);
             // 此处作用很大，可以扩展很多功能。
             // 比如对接多个后台，数据结构不一致，可做接口适配器
             // 也可对返回日期/金额/数字等统一做集中处理
             if(res.statusCode === '200'){
                 console.log(res.data)
                 resolve(res.data);
             }else{
                 // 通过配置可关闭错误提示
                message.error(res.message as string);
                console.log('error111')
                reject(res);
             }
         }).catch((error)=>{
            message.error(error.message)
            reject(error);
         }).finally(()=>{
            //  loadingInstance.close();
            console.log('end')
         })
     })
 }
 // 封装GET请求
 export const get = (url: string, params: any) => {
     return request(url,params,'get')
 }
 // 封装POST请求
 export const post = (url: string, params = {}) => {
     return request(url,params,'post').catch(v => v)

 }

 // 封装put请求
 export const put = (url: string, params = {}) => {
     return request(url,params,'put').catch(v => v)
 }

  // 封装delete请求
  export const del = (url: string, params = {}) => {
    return request(url,params,'delete').catch(v => v)
}