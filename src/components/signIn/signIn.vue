<template>
  <div id="signin-component">
  	<div class="Header">
  		登 陆
  	</div>
    <div class="InputWrapper">
      <Input prefix="md-home" placeholder="公司名称" style="width: 250px;" size="large" v-model="campanyName"/>
    </div>
    <div class="InputWrapper">
      <Input prefix="md-contact" placeholder="用户名" style="width: 250px" size="large" v-model="userName"/>
    </div>
    <div class="InputWrapper">
      <Input prefix="md-key" placeholder="密码" style="width: 250px" size="large" type="password" v-model="password"/>
    </div>
    <div class="InputWrapper">
    	<Button size="large" type="success" style="width: 250px;" @click="signin">提交</Button>
    </div>
  </div>
</template>
<script type="text/javascript">

export default {
	data: function() {
		return {
			campanyName: "",
			userName: "",
			password: ""
		}
	},
	methods: {
		signin: function() {
			this.$store.commit("toggleIsSignin");
		}
	}
}

</script>
<style  scoped>
.Header {
	margin-top: 30px;
	text-align: center;
	font-size: 30px;
	font-weight: bold;
}
.InputWrapper {
	margin: auto;
	margin-top: 30px;
	text-align: center;
}
</style>
