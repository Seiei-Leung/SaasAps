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
            <Table v-bind:height="tableHeight" :loading="tableLoading" border :columns="tableTitle" :data="tableData" @on-row-dblclick="selectTable" :highlight-row="highlightRow"></Table>
          </div>
        </div>
      </div>
      <div class="rightContainer">
        <div class="title">
          生产线
        </div>
        <div class="bottomContain" ref="rightContainer">
          <Tree :data="mainTreeData" show-checkbox multiple ref="mainTree"></Tree>
        </div>
        <div style="margin-top: 15px;text-align:center;">
        	<Button type="primary" @click="getSelectedNodes">保 存 设 置</Button>
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
      tableData: [],
      mainTreeData: [],
      highlightRow: true,
      selectedUserId: "",
      selectedPSLine: []
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
      this.axios.get(this.seieiURL + "/psright/getPSRightProductLine").then((response) => {
        that.mainTreeData.push(response.data.data);
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
    },
    selectTable: function(data, index) {
      this.clearChecked();
      this.selectedUserId = data.id;
      var that = this;
      this.axios.get(this.seieiURL + "/psright/getPSRightByUserId", {
        params: {
          id: data.id
        }
      }).then((response) => {
      this.test = true
      	var resultList = [];
        var
          mainTreeData = that.mainTreeData[0].children,
          resultmainTreeData = that.mainTreeData[0].children.slice();
        response.data.data.forEach((item) => {
          for (var i = 0; i < mainTreeData.length; i++) {
            var treeBean = mainTreeData[i].children;
            for (var n = 0; n < treeBean.length; n++) {
              var treeBean1 = treeBean[n].children;
              for (var m = 0; m < treeBean1.length; m++) {
                if (treeBean1[m].serialno == item.lineserialno) {
                  resultmainTreeData[i].children[n].children[m].checked = true;
                }
              }
            }
          }
        });
        var resultList = [];
        var resultObj = {};
        resultObj.title = "全部";
        resultObj.children = resultmainTreeData;
        resultObj.expand = true;
        resultList.push(resultObj);
        that.mainTreeData = resultList;
      }).catch((error) => {
        that.tableLoading = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });

    },
    clearChecked: function() {
      var
        mainTreeData = this.mainTreeData[0].children,
        resultmainTreeData = mainTreeData.slice(0, mainTreeData.length);

      for (var i = 0; i < resultmainTreeData.length; i++) {
        var treeBean = resultmainTreeData[i].children;
        for (var n = 0; n < treeBean.length; n++) {
          var treeBean1 = treeBean[n].children;
          for (var m = 0; m < treeBean1.length; m++) {
            resultmainTreeData[i].checked = false;
            resultmainTreeData[i].expand = false;
            resultmainTreeData[i].indeterminate = false;
            resultmainTreeData[i].children[n].checked = false;
            resultmainTreeData[i].children[n].expand = false;
            resultmainTreeData[i].children[n].indeterminate = false;
            resultmainTreeData[i].children[n].children[m].checked = false;
          }
        }
      }
      var resultList = [];
      var resultObj = {};
      resultObj.title = "全部";
      resultObj.children = resultmainTreeData;
      resultObj.expand = false;
      resultList.push(resultObj);
      this.mainTreeData = resultList;
      console.log(this.mainTreeData)
    },
    getSelectedNodes: function() {
      console.log(this.$refs.mainTree.getSelectedNodes());
      console.log(this.$refs.mainTree.getCheckedNodes());
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - cssData.pageHeaderHeight - cssData.containerPageTabHeight + "px";
      var topContainHeight = Math.floor((this.windowHeight - cssData.pageHeaderHeight - cssData.containerPageTabHeight - cssData.rightBlockTabpaneWrapperPaddingBottom) / 2) - cssData.topWrapperTitleHeight - cssData.topWrapperTitleMarginTop - cssData.borderHeight * 2;
      this.tableHeight = topContainHeight;
      this.$refs["topContain"].style.height = topContainHeight + "px";
      this.$refs["rightContainer"].style.height = this.windowHeight - cssData.pageHeaderHeight - cssData.containerPageTabHeight - cssData.rightBlockTabpaneWrapperPaddingBottom - cssData.topWrapperTitleHeight - cssData.borderHeight * 4 - 47 + "px";

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
}

#psRoleSetting-component .leftContainer .topWrapper,
#psRoleSetting-component .leftContainer .bottomWrapper {
  box-sizing: border-box;
}



#psRoleSetting-component .leftContainer .topContain,
#psRoleSetting-component .leftContainer .bottomContain,
#psRoleSetting-component .rightContainer .bottomContain {
  box-sizing: border-box;
}

#psRoleSetting-component .leftContainer .topContain,
#psRoleSetting-component .rightContainer .bottomContain {
  padding: 5px;
  font-size:14px;
  border: 1px solid #ddd;
  border-top: none;
  overflow-y: scroll;
}

#psRoleSetting-component .leftContainer .topContain {
  padding-left: 5px;
}

#psRoleSetting-component .leftContainer .topWrapper .title,
#psRoleSetting-component .leftContainer .bottomWrapper .title,
#psRoleSetting-component .rightContainer .title {
  box-sizing: border-box;
  padding-left: 1.5em;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  background-color: #717171;
  color: #fff;
}

</style>
