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
          <Icon type="md-home" /><span>{{companyName}}</span>
        </div>
        <div class="msgItem">
          <Icon type="md-contact" /><span>{{userName}}</span>
        </div>
        <div class="msgItem">
          <span> IP </span>
          <span>
          		<Dropdown @on-click="userDropdownEvent">
        			<span>
            			{{userID}}
            			<Icon type="ios-arrow-down"></Icon>
        			</span>
          			<DropdownMenu slot="list">
            			<DropdownItem name="signout">登出</DropdownItem>
          			</DropdownMenu>
          		</Dropdown>
          </span>
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
  methods: {
    userDropdownEvent: function(name) {
      var that = this;
      if (name == "signout") {
        this.axios.get(this.seieiURL + "/syusers/signout").then((response) => {
          if (response.data.status == 0) {
            sessionStorage.clear();
            that.$Message.success(response.data.msg);
            that.$store.commit("toggleIsSignin");
            that.$store.commit("toggleIsAdmin", false);
          } else {
            that.$Message.error(response.data.msg);
          }
        }).catch((error) => {
          that.$Message.error({
            content: "服务器异常,请刷新！！",
            duration: 0,
            closable: true
          });
          console.log(error);
        });
      }
    }
  },
  created: function() {
    var userMsg = JSON.parse(sessionStorage.getItem(CONST.CURRENT_USER_MSG));
    if (userMsg) {
      this.userName = userMsg.name;
      this.userID = userMsg.code;
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

.leftBlock .title {
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
