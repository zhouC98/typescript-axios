import axios from '../../src'


axios.interceptors.request.use((config: any) => {
  config.headers.test += '1'
  return config
})

axios.interceptors.response.use((res: any) => {
  res.data.msg += '1321321'
  return res.data
})

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: ''
  }
}).then((res) => {
  console.log(res)
})
