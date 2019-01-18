<template>
	<view>
		<view class="page">
			<view class="uni-product-list">
				<view class="uni-product" v-for="(product,index) in productList" :key="index" @click="buyProduct(product)">
					<view class="image-view">
						<image v-if="renderImage" class="uni-product-image" lazy-load="true" :src="product.image"></image>
					</view>
					<view class="uni-product-title">{{product.title}}</view>
					<view class="uni-product-price">
						<!-- <text class="uni-product-price-favour">￥{{product.originalPrice}}</text> -->
						<text class="uni-product-price-original">￥{{product.favourPrice}}</text>
						<text v-if="product.couponPrice>0" class="uni-product-tip">优惠{{product.couponPrice}}元</text>
					</view>
				</view>
			</view>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
	</view>
</template>

<script>
	import http_util from '../../../utils/http.js'

	export default {
		data() {
			return {
				title: '精选',
				productList: [],
				renderImage: false,
				page: 1,
				limit: 6,
				hasNextPage: true,
				loadMoreText: "加载中...",
				showLoadMore: false
			};
		},
		methods: {
			loadData(action = 'add') {
				const data = [{
					image: 'http://img.alicdn.com/bao/uploaded/i4/2295782084/O1CN01i7fCEO1RGVtF4GbVL_!!0-item_pic.jpg',
					title: '宠物消毒液狗狗除臭剂杀菌消毒室内去味狗猫去尿味香水除味狗用品',
					originalPrice: 9999,
					favourPrice: 8888,
					couponDes: '自营',
					url: 'https://uland.taobao.com/coupon/edetail?e=xrz%2Foh0UeUcN%2BoQUE6FNzDydKjAPoJ2yip8fGWWASRQIt44sJ9gJLHIvNKrjhii7Qxx0VwCzIlRfg86gtGqdXxpywujSvOp2nUIklpPPqYIrqLfM3rCyMXPowVog9CAkKM0gjBgnIDoisYXngcEZfsEsajgUusCX2lHRRnS20LU%3D&af=1&pid=mm_130330328_45986883_736638570'
				}];
				if (action === 'refresh') {
					this.page = 1;
					this.hasNextPage = true;
					this.productList = [];
					this.loadMoreText = '加载中...';
					this.showLoadMore = false;
				}
				// this.productList.push(data[0]);
				let that = this
				http_util._post({
					url: '/taoke/product/list',
					data: {
						page: that.page,
						limit: that.limit,
						orderBy: '(sales*commission) desc'
					},
					success: function(res) {
						// console.log(res.data)
						uni.setNavigationBarTitle({
							title: '今日更新' + res.data.data.total + '件'
						});
						that.hasNextPage = res.data.data.hasNextPage;
						that.page++;
						let _list = res.data.data.list;
						_list.forEach(item => {
							item.url = item.couponTUrl;
							// item.url=item.couponUrl;
							// item.url=item.linkT;
							item.image = item.picUrl;
							item.title = item.name;

							item.price = parseFloat(item.price);
							item.couponPrice = 0;

							var _a = (item.couponDes + '').match(/(\d+(\.\d+)?)/g);
							if (_a) {
								if (_a.length == 1) {
									item.couponPrice = parseFloat(_a[0]);
								} else {
									item.couponPrice = parseFloat(_a[1]);
								}
							} else {
								item.couponPrice = 0;
							}
							item.favourPrice = (item.price - item.couponPrice).toFixed(2);

							that.productList.push(item);
						});
					},
					fail: function(e) {
						console.log(e)
					}
				});
			},
			buyProduct: function(res) {
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
							// console.log('complete', res)
						}
					});
				}
			}
		},
		onLoad() {
			this.loadData();
			setTimeout(() => {
				this.renderImage = true;
			}, 300);
		},
		onShow: function() {
			http_util.initSubmit();
		},
		onReachBottom: function() {
			this.showLoadMore = true;
			if (!this.hasNextPage) {
				this.loadMoreText = "没有更多数据了!"
				return;
			} else {
				this.loadData();
			}
		},
		onPullDownRefresh() {
			this.loadData('refresh');
			// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 2000);
		}
	};
</script>

<style>

</style>
