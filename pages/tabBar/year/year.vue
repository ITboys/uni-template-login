<template>
	<view style="width: 100%;">
		<view class="banner" @click="goDetail(banner)">
			<image class="banner-img" :src="banner.cover"></image>
			<view class="banner-title">{{banner.title}}</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="key" @click="goDetail(value)">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" lazy-load="true" :src="value.cover"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.title}}</view>
						<view class="uni-media-list-text-bottom">
							<text>{{value.author_name}}</text>
							<text>{{value.published_at}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var dateUtils = require('../../../common/util.js').dateUtils;
	import http_util from '../../../utils/http.js'

	export default {
		data() {
			return {
				banner: {
					cover: 'https://gw.alicdn.com/tfs/TB1R2cag6ihSKJjy0FfXXbGzFXa-440-180.jpg',
					title: '',
					url: 'https://ai.m.taobao.com/search.html?pid=mm_130330328_308450038_84136700477'
				},
				listData: [{
					cover: 'https://gw.alicdn.com/tfs/TB1rJCzoPTpK1RjSZKPXXa3UpXa-750-275.png_q75.jpg',
					title: '聚划算热销TOP榜等你撩',
					author_name: '聚划算',
					published_at: '2019-01-13',
					url: 'https://mo.m.taobao.com/union/1111_ys_rexiao?pid=mm_130330328_308450038_84136700477'
				}, {
					cover: 'https://gw.alicdn.com/tfs/TB1jSJYoZbpK1RjSZFyXXX_qFXa-750-275.png_q75.jpg',
					title: '大额券必抢单品',
					author_name: '领券',
					published_at: '2019-01-10',
					url: 'https://mo.m.taobao.com/union/1111_quan?pid=mm_130330328_308450038_84136700477',
				}, {
					cover: 'https://gw.alicdn.com/tfs/TB1KE6rkwoQMeJjy1XaXXcSsFXa-440-180.jpg',
					title: '天猫最热优惠券',
					author_name: '天猫',
					published_at: '2019-01-10',
					url: 'https://temai.m.taobao.com/index.htm?pid=mm_130330328_308450038_84136700477',
				}, {
					cover: 'http://gtms03.alicdn.com/tps/i3/TB1ibblIpXXXXczXVXXQO4D5VXX-440-180.jpg',
					title: '火车票、飞机票、汽车票、酒店、景点门票',
					author_name: '飞猪',
					published_at: '2019-01-10',
					url: 'https://s.click.taobao.com/gCYMrGw',
				}],
				last_id: "",
				reload: false
			}
		},
		onLoad() {
			this.getBanner();
			this.getList();
			http_util.initSubmit();
		},
		onShow: function() {
			http_util.initSubmit();
		},
		onPullDownRefresh() {
			this.reload = true;
			this.last_id = "";
			this.getBanner();
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			getBanner() {
				return;

				let data = {
					column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
				};
				uni.request({
					url: 'http://h5.liujinlei.com/banner.json',
					data: data,
					dataType: 'json',
					success: (data) => {
						console.log(data)
						uni.stopPullDownRefresh();
						if (data.statusCode == 200) {
							this.banner = data.data;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				})
			},
			getList() {
				return;
				var data = {
					column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
				};
				if (this.last_id) { //说明已有数据，目前处于上拉加载
					data.minId = this.last_id;
					data.time = new Date().getTime() + "";
					data.pageSize = 10;
				}
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/news',
					data: data,
					success: (data) => {
						if (data.statusCode == 200) {
							let list = this.setTime(data.data);
							this.listData = this.reload ? list : this.listData.concat(list);
							this.last_id = list[list.length - 1].id;
							this.reload = false;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				})
			},
			goDetail: function(res) {
				if (res.url) {
					uni.navigateTo({
						url: '../../web-view/web-view?url=' + encodeURIComponent(res.url),
						success: function(e) {
							console.log('success:', e);
						},
						fail: function(e) {
							console.log('fail', e);
						},
						complete: function(res) {
							console.log('complete', res)
						}
					});
				}
				return;
				var e = res;
				// 				if (!/前|刚刚/.test(e.published_at)) {
				// 					e.published_at = dateUtils.format(e.published_at);
				// 				}
				let detail = {
					author_name: e.author_name,
					cover: e.cover,
					id: e.id,
					post_id: e.post_id,
					published_at: e.published_at,
					title: e.title
				}
				uni.navigateTo({
					url: "../list2detail-detail/list2detail-detail?detailDate=" + encodeURIComponent(JSON.stringify(detail))
				})
			},
			setTime: function(items) {
				var newItems = [];
				items.forEach((e) => {
					newItems.push({
						author_name: e.author_name,
						cover: e.cover,
						id: e.id,
						post_id: e.post_id,
						published_at: dateUtils.format(e.published_at),
						title: e.title
					});
				});
				return newItems;
			}
		},
	}
</script>

<style>
	.banner {
		height: 360upx;
		width: 100%;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.uni-media-list-logo {
		width: 380upx;
		height: 140upx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
