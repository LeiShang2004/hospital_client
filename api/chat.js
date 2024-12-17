import request from '@/utils/request.js'

/**
 * 通过id获取用户信息
 * @param {Object} id 用户id
 */
export function getUserInfo(id) {
	return request({
		url: `/users/${id}`,
		method: 'get'
	})
}