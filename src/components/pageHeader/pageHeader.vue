<template>
	<div id="pageHeader-component">
		<div class="pageHeader">
			<div class="leftBlock">
				<div class="title">
					{{appName}}
				</div>
			</div>
			<div class="rightBlock">
				<div class="msgItem">
					<Icon type="md-home"/><span>{{companyName}}</span>
				</div>
				<div class="msgItem">
					<Icon type="md-contact" /><span>{{userName}}</span>
				</div>
				<div class="msgItem">
					<span> IP </span><span>{{userID}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			companyName: "公司名称",
			userName: "用户名",
			userID: "用户ID"
		}
	},
	created: function() {
		if (localStorage.userMsg) {

		}
	}
}
</script>

<style scoped>
.pageHeader {
	font-size: 0;
	line-height: 40px;
	background-color: #565656;
	color: #fff;
}
.leftBlock {
	display: inline-block;
	vertical-align: top
}
.leftBlock .title{
	margin-left: 20px;
	font-size: 20px;
}
.rightBlock {
	float: right;
	display: inline-block;
	vertical-align: top
}
.msgItem {
	margin-right: 20px;
	display: inline-block;
	font-size: 20px;
}
.msgItem i {
	line-height: 40px;
	vertical-align: top;
	font-size: 20px;
}
</style>