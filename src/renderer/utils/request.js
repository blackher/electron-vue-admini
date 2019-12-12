import axios from 'axios'
const service = axios.create({
  baseURL: 'http://www.pig.com',
  withCredentials: false,
  timeout: 15000
})
// 如果登录的话 需要设置拦截器 查看是否是登录状态及权限
service.interceptors.request.use({

})

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 20000) {
      alert(res.msg || 'error')
      return Promise.reject(res.msg || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
