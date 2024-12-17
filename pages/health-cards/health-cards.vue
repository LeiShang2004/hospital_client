<template>
	<view class="cardLayout pageBg2">
		<view class="layout">
			<view class="navbar">
				<view class="goBack" @click="goBack">
					<uni-icons type="back" color="#000" size="20"></uni-icons>
				</view>
				<view class="text">
					我的健康卡
				</view>
				<view class="goBack">
					<!-- <uni-icons type="back" color="#fff" size="20"></uni-icons> -->
				</view>
			</view>
		</view>
		<view class="em">

		</view>
		<health-card v-for="item in 4" :cardinfo="{isExist:true}"></health-card>
		<health-card v-for="item in 1" :cardinfo="{isExist:false}"></health-card>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		getStatusBarHeight,
		getTitleBarHeight,
		getNavBarHeight
	} from "@/utils/system.js"

	const recordList = ref([]);

	//返回上一页
	const goBack = () => {
		uni.navigateTo({
			url: '/pages/index/index'
		})
	}
</script>

<style lang="scss" scoped>
	.cardLayout {
		padding: 30rpx;

		.layout {
			.navbar {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				z-index: 10;
				padding: 30rpx 0;
				background:
					linear-gradient(to bottom, transparent 0%, #fff 400rpx),
					linear-gradient(to left, #f6d365 20%, #fda085);
				display: flex;
				flex-direction: row; //设置布局方向为水平

				.goBack {
					width: 38rpx;
					height: 38rpx;
					// background: rgba(0, 0, 0, 0.5);
					// left: 30rpx;
					margin: 0 30rpx;
					border-radius: 100px;
					top: 0;
					backdrop-filter: blur(10rpx);
					border: 1rpx solid rgba(255, 255, 255, 0.3);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.text {
					width: 554rpx;
				}
			}
		}

		.em {
			height: 98rpx;
		}
	}
</style>