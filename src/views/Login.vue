<template>
	<div>
		<el-form ref="loginForm" :rules="rules" :model="loginForm" class="loginContainer" hide-required-asterisk
			v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)">
			<h3 class="loginTitle">系统登录</h3>
			<el-form-item label="账	号" prop="username">&nbsp;
				<el-input type="text" v-model="loginForm.username" placeholder="输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="密	码" prop="password">&nbsp;
				<el-input type="password" v-model="loginForm.password" placeholder="输入密码">
				</el-input>
			</el-form-item>
			<el-form-item label="验证码" prop="code">
				<el-input type="code" v-model="loginForm.code" placeholder="点击图片更换验证码" style="margin-right: 5px;">
				</el-input>
				<img :src="captchaUrl" @click="updateCaptcha" />
			</el-form-item>
			<el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
			<el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: "Login",
		data() {
			return {
				captchaUrl: '/captcha?time=' + new Date(),
				loginForm: {
					username: 'admin',
					password: '123',
					code: ''
				},
				checked: true,
				loading: false,
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			updateCaptcha() {
				this.captchaUrl = '/captcha?time=' + new Date();
			},
			submitLogin() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.loading=true;
						this.postRequest("/login", this.loginForm).then(resp => {
							if (resp) {
								this.loading=false;
								//存储用户token
								const tokenStr = resp.object.tokenHead + resp.object.token;
								window.sessionStorage.setItem('tokenStr', tokenStr);
								//跳转首页
								this.$router.replace('/home')
							}
              this.loading=false;
						})
						
					} else {
						this.$message({
							message: '请输入所有字段',
							type: 'warning'
						});
						return false;
					}
				});
			}
		}
	}
</script>

<style>
	.loginContainer {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 180px auto;
		width: 320px;
		padding: 15px 35px 15px 35px;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}

	.loginTitle {
		margin: 0px auto 40px auto;
		text-align: center;
	}

	.loginRemember {
		text-align: left;
		margin: 0px 0px 15px 0px;
	}

	.el-form-item__content {
		display: flex;
		align-items: center;
	}
</style>
