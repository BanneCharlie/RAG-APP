/**
 * Axios HTTP 客户端（对应后端 HttpClient / RestTemplate）
 * 单例模式，全局共享一个实例
 */
import axios from 'axios'
import { appConfig } from '@/config/app'
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors'

/**
 * 创建 Axios 实例
 * 配置项对应后端的 RestTemplate 配置（连接超时、读取超时等）
 */
const httpClient = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: appConfig.requestTimeout,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  // 允许跨域携带凭证
  withCredentials: false,
})

// 注册拦截器（对应后端 aspect 切面）
setupRequestInterceptor(httpClient)
setupResponseInterceptor(httpClient)

export default httpClient
