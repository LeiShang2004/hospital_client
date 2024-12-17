<template>
	<view class="doctorLayout pageBg">
		<view class="layout">
			<view class="navbar">
				<view class="goBack" @click="goBack">
					<uni-icons type="back" color="#000" size="20"></uni-icons>
				</view>
				<view class="text">
					医生日期选择
				</view>
				<view class="goBack">
					<!-- <uni-icons type="back" color="#fff" size="20"></uni-icons> -->
				</view>
			</view>
		</view>
		<view class="em">

		</view>
		<view class="upBar">
			<view :class="['anyDay', datepos===0 ? 'self' : 'other']" @click="showAllDoctorList">
				<text class="t1">坐诊</text>
				<text class="t2">医生</text>
			</view>
			<scroll-view :show-scrollbar="false" scroll-x="true" class="fixedDay">
				<view class="fixDay" v-for="(item,index) in date" :key="item.id">
					<view :class="['box', item.id===datepos ? 'self' : 'other']"
						@click="showThisDay(item.time.date,item.id)">
						<text class="t1">{{item.time.week}}</text>
						<text class="t2">{{item.time.date}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="doctor" v-for="item in showDoctorList">
			<view class="up-content">
				<view class="box2">
					<!-- 					<view class="image">
						<image src="../../static/zxj/male.png" mode="aspectFill"></image>
					</view> -->
					<view class="row">
						<view class="parent-view">
						  <view class="text" style="font-weight: bold; float: left">{{item.name}}</view>
						  <view class="feeText" style="float: right">{{feehash[item.title]}}</view>
						</view>
						<br />
						<view class="smallText">{{item.introduction}}</view>
					</view>
				</view>
			</view>
			<view class="bar"></view>
			<view class="down-content">
				<scroll-view :show-scrollbar="false" scroll-x="true" class="downFixedDay">
					<view class="downFixDay" v-for="it in item.schedule"
						@click="navToDetail(item.doctorId,it.date,item)">
						<view class="box">
							<view class="t1">{{it.week}}</view>
							<view class="t2">{{it.date}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getBySpecializationId
	} from '@/api/schedule.js'
	import {
		formatDateToChinese
	} from '@/utils/date.js'

	const titlehash = {
		'1': '医士',
		'2': '医师',
		'3': '主治医师',
		'4': '副主任医师',
		'5': '主任医师',
		'6': '专家'
	}
	const feehash = {
		'医士': '￥ 15',
		'医师': '￥ 25',
		'主治医师': '￥ 35',
		'副主任医师': '￥ 50',
		'主任医师': '￥ 100',
		'专家': '￥ 300'
	}
	const specializationsId = ref()
	const date = ref([])
	const showDoctorList = ref([

	])
	const doctorList = ref([])

	//高亮坐标
	const datepos = ref([0]);

	onLoad((option) => {
		specializationsId.value = option.specializationId
		async function getDoctorList() {
			//获取现在的日期与周几
			let now = new Date()
			//date.value.push({id:1,time:formatDateToChinese(now)})
			//将包括今天在内7天的总日期存入date中
			for (let i = 0; i < 6; i++) {
				now.setDate(now.getDate() + 1)
				date.value.push({
					id: i + 1,
					time: formatDateToChinese(now)
				});
			}
			//获取到所有该科室下医生的排班信息
			let res = await getBySpecializationId(specializationsId.value)
			let doctorHash = {}
			res = res.data
			console.log(res)
			now = new Date()
			for (let i = 0; i < res.length; i++) {
				let z = new Date(res[i].date)
				//如果月和日与今天相同，则忽略
				if (now.getDate() == z.getDate() && now.getMonth() == z.getMonth()) continue
				let part = formatDateToChinese(z)
				if (doctorHash.hasOwnProperty(res[i].doctorId)) {
					if (doctorHash[res[i].doctorId].schedule.hasOwnProperty(part.date)) {
						doctorHash[res[i].doctorId].schedule[part.date].registration.push({
							time: res[i].time,
							remain: res[i].availableNumber,
							scheduleId: res[i].scheduleId
						})
					} else {
						doctorHash[res[i].doctorId].schedule[part.date] = {
							date: part.date,
							week: part.week,
							registration: [{
								time: res[i].time,
								remain: res[i].availableNumber,
								scheduleId: res[i].scheduleId
							}]
						}
					}
				} else {
					let doctor = {}
					doctor.doctorId = res[i].doctorId
					doctor.name = res[i].doctorName
					doctor.title = titlehash[res[i].titleId]
					doctor.introduction = res[i].introduction
					doctor.schedule = {}
					doctor.schedule[part.date] = {
						date: part.date,
						week: part.week,
						registration: [{
							time: res[i].time,
							remain: res[i].availableNumber,
							scheduleId: res[i].scheduleId
						}]
					}
					doctorHash[res[i].doctorId] = doctor
				}
			}
			for (let key in doctorHash) {
				doctorList.value.push(doctorHash[key])
			}
			if (doctorList.value) showDoctorList.value = doctorList.value;
			console.log(showDoctorList)
		}
		console.log(doctorList)
		getDoctorList()
	})

	const showAllDoctorList = () => {
		showDoctorList.value = doctorList.value
		datepos.value = 0
	}
	const showThisDay = (date, id) => {
		//把传递进来的日期的医生筛选出来，然后只显示这些医生这天的排班信息
		showDoctorList.value = []
		for (let i = 0; i < doctorList.value.length; i++) {
			let doctor = {}
			doctor.doctorId = doctorList.value[i].doctorId
			doctor.name = doctorList.value[i].name
			doctor.title = doctorList.value[i].title
			doctor.schedule = []
			doctor.introduction=doctorList.value[i].introduction
			for (let key in doctorList.value[i].schedule) {
				if (key == date) doctor.schedule.push(doctorList.value[i].schedule[key])
			}
			if (doctor.schedule.length != 0) showDoctorList.value.push(doctor)
		}
		datepos.value = id
		console.log(showDoctorList)
	}
	const navToDetail = (id, date, doctor) => {
		// console.log(id)
		// console.log(date)
		//console.log(doctor)
		uni.navigateTo({
			url: `/pages/doctor-details/doctor-details?id=${id}&date=${date}`
		})
	}
	const goBack = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.doctorLayout {
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

		.upBar {
			display: flex;
			flex-direction: row;
			padding: 0 30rpx;

			// background: #e8e8e4;
			.anyDay {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 120rpx;
				height: 120rpx;
				padding: 10rpx 0 10rpx 0;
				margin-top: 10rpx;
				margin-right: 10rpx;
				background-color: white;
				border-radius: 20rpx;
				box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
				flex-direction: column;

				&.self {

					color: #fda085;

				}

				&.other {
					color: #000;
				}
			}

			.fixedDay {
				display: flex;
				flex-direction: row;
				max-width: 550rpx;
				height: 140rpx;
				padding: 10rpx 0 10rpx 0;
				white-space: nowrap;
				scroll-behavior: smooth;
				-webkit-overflow-scrolling: touch;

				.fixDay {
					width: 120rpx;
					height: 120rpx;
					margin: 0 5rpx 0 5rpx;
					background-color: white;
					// background-color: red;
					border-radius: 20rpx;
					box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
					display: inline-block;

					.box {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100%;
						height: 100%;
						flex-direction: column;

						.t1 {
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 30rpx;
							// color: #333;
						}

						.t2 {
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 30rpx;
							// color: #666;
						}

						&.self {

							color: #fda085;

						}

						&.other {
							color: #000;
						}
					}

				}
			}
		}

		.doctor {
			height: 370rpx;
			width: 690rpx;
			border-radius: 30rpx;
			box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
			margin: 20rpx auto;
			background-color: white;

			// background: red;
			.up-content {
				height: 180rpx;
				// background: skyblue;
				border-radius: 30rpx 30rpx 0 0;

				.box2 {
					display: flex;
					flex-direction: row;
					height: 150rpx;

					.image {
						width: 250rpx;
						box-sizing: border-box;
					}
					
					.row {
						width: 440rpx;
						height: 150rpx;
						margin: 25rpx;
						display: flex;
						flex-direction: column;
						// justify-content: center;
						// align-items: center;
						font-size: 30rpx;

						// background: red;
						color: #333;

						.text {
							// padding:0rpx;
						}

						.smallText {
							// padding-right:0 5px;
							// margin-bottom: 180rpx;
							font-size: 30rpx;
							color: #666;
						}

						.feeText {
							color: red;
							font-size: 30rpx;
						}
					}
				}
			}

			.bar {
				height: 5rpx;
				background: #e8e8e4;
			}

			.down-content {
				height: 150rpx;
				// background: pink;
				border-radius: 0 0 30rpx 30rpx;

				.downFixedDay {
					display: flex;
					flex-direction: row;
					max-width: 670rpx;
					height: 145rpx;
					padding: 20rpx;
					white-space: nowrap;
					scroll-behavior: smooth;
					-webkit-overflow-scrolling: touch;

					.downFixDay {
						width: 125rpx;
						height: 125rpx;
						margin: 0 5rpx 0 5rpx;
						// background-color: red;
						border-radius: 20rpx;
						box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
						display: inline-block;

						.box {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							height: 100%;
							flex-direction: column;

							.t1 {
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 30rpx;
								color: #333;
							}

							.t2 {
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 30rpx;
								color: #666;
							}
						}

					}
				}
			}
		}
	}
</style>