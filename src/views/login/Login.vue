<template>
<div class="login-container">
  <div class="login-box">
    <!--左边背景图 start-->
    <!--左边背景图 end-->
    <!--登录表单 start-->
    <div class="login-form">
      <!--标题和logo start-->
      <div class="login-title">
        <h2 class="title">学生信息管理系统</h2>
      </div>
      <!--标题和logo end-->
      <!--登录表单组件 start-->
       <LoginForm/>
      <!--登录表单组件 end-->
    </div>
    <!--登录表单 end-->
  </div>
</div>
</template>

<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'
</script>

<style scoped>
.login-container {
  background-color: #f0f2f5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 25px;
  box-sizing: border-box;
  /* 如果需要固定宽度和高度，请添加下面的样式 */
  width: 1000px;
  height: 700px;
}
.login-box {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fffc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-left{
  width: 50%;
}
.login-left img{
  width: 100%;
  max-width: 900px;
}

.login-form{
  max-width: 480px;
  width: 50%;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-sizing: border-box;
}

.login-title{
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 30px;
}

.login-title .title{
  margin: 0;
  font-size: 30px;
  white-space: nowrap;
}
.login-title .icon{
  width: 60px;
}

::v-deep(.el-input__inner){
  height: 40px;
}

</style>
