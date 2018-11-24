<template>
  <div id="psRoleSetting-component">
    <div class="psRoleSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <div class="leftContainer">
        <div class="topWrapper">
          <div class="title">
            用户组别
          </div>
          <div class="topContain" ref="topContain">
            <Tree :data="treeData" @on-select-change="selectUserGroup"></Tree>
          </div>
        </div>
        <div class="bottomWrapper" style="margin-top: 10px;">
          <div class="title">
            用户列表
          </div>
          <div class="bottomContain">
            <Table v-bind:height="tableHeight" :loading="tableLoading" border :columns="tableTitle" :data="tableData"></Table>
          </div>
        </div>
      </div>
      <div class="rightContainer">
      	<div class="title">
      		生产线
      	</div>
      	<div class="bottomContain" ref="rightContainer">
      		
      	</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      treeData: [],
      tableHeight: 0,
      tableLoading: false,
      tableTitle: [{
        title: '编码',
        key: 'code'
      }, {
        title: '姓名',
        key: 'name'
      }],
      tableData: []
    }
  },
  methods: {
    reloadMainTable: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/sygroup/getAll").then((response) => {
        that.treeData = response.data.data;
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    selectUserGroup: function(data) {
      console.log(data)
      var that = this;
      this.tableLoading = true;
      this.axios.get(this.seieiURL + "/syusers/getallbytreecode", {
        params: {
          treeCode: data[0].resource.treecode
        }
      }).then((response) => {
        that.tableLoading = false;
        that.tableData = response.data.data;
      }).catch((error) => {
        that.tableLoading = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - cssData.pageHeaderHeight - cssData.containerPageTabHeight + "px";
      var topContainHeight = Math.floor((this.windowHeight - cssData.pageHeaderHeight - cssData.containerPageTabHeight - cssData.rightBlockTabpaneWrapperPaddingBottom) / 2) - cssData.topWrapperTitleHeight - cssData.topWrapperTitleMarginTop - cssData.borderHeight * 2;
      this.tableHeight = topContainHeight;
      this.$refs["topContain"].style.height = topContainHeight + "px";
      this.$refs["rightContainer"].style.height = this.windowHeight - cssData.pageHeaderHeight - cssData.containerPageTabHeight - cssData.rightBlockTabpaneWrapperPaddingBottom - cssData.topWrapperTitleHeight - cssData.borderHeight * 4 + "px";

    });
    this.reloadMainTable();
  }
}

</script>
<style scoped>
#psRoleSetting-component {
  font-size: 0
}

#psRoleSetting-component .leftContainer,
#psRoleSetting-component .rightContainer {
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  width: 30%;
}

#psRoleSetting-component .rightContainer {
  margin-left: 1%;
  width: 69%;
  border: 1px solid #ddd;
}

#psRoleSetting-component .leftContainer .topWrapper,
#psRoleSetting-component .leftContainer .bottomWrapper {
  box-sizing: border-box;
}

#psRoleSetting-component .topWrapper {
  border: 1px solid #ddd;
}

#psRoleSetting-component .leftContainer .topContain,
#psRoleSetting-component .leftContainer .bottomContain,
#psRoleSetting-component .rightContainer .bottomContain {
  box-sizing: border-box;
}

#psRoleSetting-component .leftContainer .topContain,
#psRoleSetting-component .rightContainer .bottomContain {
  overflow-y: scroll;
}

#psRoleSetting-component .leftContainer .topContain {
  padding-left: 5px;
}

#psRoleSetting-component .leftContainer .topWrapper .title,
#psRoleSetting-component .leftContainer .bottomWrapper .title,
#psRoleSetting-component .rightContainer .title{
  box-sizing: border-box;
  padding-left: 1.5em;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  border-bottom: 1px solid #ddd;
  background-color: #717171;
  color: #fff;
}

#psRoleSetting-component .leftContainer .bottomWrapper .title {
  border: 1px solid #ddd;
  border-bottom: none
}

</style>
