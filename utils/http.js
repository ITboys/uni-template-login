function _post(params) {
	params.url = 'http://www.liujinlei.com' + params.url;
	params.method = 'POST';
	params.header = {
		'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
	}

	// console.log("参数：", params.data)
	uni.request(params);
}

export default {
	_post
}
