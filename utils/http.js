let _server_host = 'http://www.liujinlei.com';

function _post(params) {
	params.url = _server_host + params.url;
	// params.url = 'http://192.168.1.10:8080' + params.url;

	params.method = 'POST';
	params.header = {
		'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
	}
	params.fail = function(e) {
		console.log(e);
	}
	// console.log("参数：", params.data)
	uni.request(params);
}
/**提交百度*/
function submit_baidu() {
	var bp = document.createElement('script');
	var curProtocol = window.location.protocol.split(':')[0];
	if (curProtocol === 'https') {
		bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
	} else {
		bp.src = 'http://push.zhanzhang.baidu.com/push.js';
	}
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(bp, s);
}
/* 提交百度统计 */
function submit_baidu_hm() {
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?967a2d05b8e6914196d457bf74c81fd1";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
}

function initSubmit() {
	// #ifdef H5
	submit_baidu();
	submit_baidu_hm();
	// #endif
}

function login_qq(params, function_success) {
	_post({
		url: _server_host + '/',
		data: params,
		success: function(res) {
			// console.log(res);
			if (typeof(function_success) == 'function') {
				function_success(res);
			}
		}
	})
}
export default {
	_post,
	initSubmit
}
