<template>
  <view class="chat-container pageBg2">
	<view class="layout">
	<view class="navbar">
		<view class="goBack" @click="goBack">
			<uni-icons type="back" color="#000" size="20"></uni-icons>
		</view>
		<view class="text">
			智能客服
		</view>
		<view class="goBack">
			<!-- <uni-icons type="back" color="#fff" size="20"></uni-icons> -->
		</view>
	</view>
	</view>
	<view class="em">
	  
	</view>
    <!-- 消息列表 -->
    <scroll-view scroll-y class="message-list" :scroll-into-view="'msg-'+messages.length" :style="{ height: chatHeight + 'px' }">
      <block v-for="(message, index) in messages" :key="index">
        <view :id="'msg-'+index" :class="['message-bubble', message.isSelf ? 'self' : 'other']">
          {{ message.text }}
        </view>
      </block>
    </scroll-view>

    <!-- 输入框和发送按钮 -->
    <view class="input-area">
      <input type="text" v-model="newMessageText" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';

// 消息数组
const messages = reactive([]);

// 新消息文本
const newMessageText = ref('');

// 计算聊天区域高度
const inputAreaHeight = 50; // 假设输入区高度为50px
const chatHeight = computed(() => window.innerHeight - inputAreaHeight);

// 发送消息的方法
const sendMessage = () => {
  if (newMessageText.value.trim() === '') return;

  // 添加新消息到消息列表
  messages.push({
    text: newMessageText.value,
    isSelf: true // 假设所有消息都是用户自己发送的
  });

  // 清空输入框
  newMessageText.value = '';

  // 模拟接收到回复
  setTimeout(() => {
    addReply();
  }, 1000); // 假设1秒后得到回复
};

const addReply = () => {
  messages.push({
    text: "这倒是",
    isSelf: false // 回复来自其他人
  });
};

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 85vh;
  position: relative;
  width: 750rpx;
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

.message-list {
  flex: 1;
  padding: 10px;
  width: 710rpx;
  overflow-y: auto;
  .message-bubble {
    // max-width: 100%;
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    word-wrap: break-word;

    &.self {
		width: 690rpx;
      background-color: #a2c0ff;
      align-self: center;
	  border-radius: 20px 20px 0 20px;
    }

    &.other {
      background-color: #eee;
      align-self: flex-start;
	  border-radius: 20px 20px 20px 0;
    }
  }
}

.input-area {
  display: flex;
  padding: 0 10px;
  width: 100%;
  position: fixed;
  height: 10vh;
  bottom: 0;
  left: 0;
  z-index: 100;
  border-top: 1px solid #ccc;
  background-color: white; // 确保输入区背景色与页面背景不同
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    margin-right: 10px;
	height:2vh;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    background-color: #007bff;
    color: white;
	height:6vh;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
  }
}
</style>