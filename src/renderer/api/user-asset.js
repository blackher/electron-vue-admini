import request from '@/utils/request'
export function fetchList (query) {
  return request({
    url: '/user-asset/list',
    method: 'get',
    params: query
  })
}
