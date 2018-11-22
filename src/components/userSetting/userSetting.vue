<template>
  <div id="userSetting-component">
    <div class="userSettingWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <!-- 左侧栏 -->
      <div class="userSettingLeftBlock" ref="userSettingLeftBlock">
        <div>
          <Tree :data="treeData" :render="renderContent"></Tree>
        </div>
      </div>
      <!-- 右侧栏 -->
      <div class="userSettingRightBlock" ref="userSettingRightBlock">
        <Table v-bind:height="tableHeight" :loading="tableLoading" border :columns="tableTitle" :data="tableData"></Table>
        <div style="margin-top: 5px; text-align: center;">
          <Button type="primary" @click="insertUserSetting">新 增 用 户 设 置</Button>
        </div>
      </div>
    </div>
    <div>
      <!-- 修改用户信息 -->
      <Modal v-model="isModifyUserSetting" v-bind:title="ModifyUserSettingTitle" @on-ok="ModifyUserSettingOk" @on-cancel="ModifyUserSettingCancel" ok-text="确认" cancel-text="取消">
        <div class="userSetting-component">
          <div class="inputBar">
            <div class="title">
              &nbsp;用户账号：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputCode" style="width: 100px"></Input>
            </div>
            <div class="title">
              用户名称：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputName" style="width: 100px"></Input>
            </div>
          </div>
          <div class="inputBar">
            <div class="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;等级：
            </div>
            <div class="inputWrapper">
              <InputNumber :max="9" :step="1" :min="1" v-model="inputGrade" style="width: 100px"></InputNumber>
            </div>
            <div class="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码：
            </div>
            <div class="inputWrapper">
              <Input v-model="inputPassWord" style="width: 100px"></Input>
            </div>
          </div>
          <div class="inputBar">
            <div class="title">
              &nbsp;超级用户：
            </div>
            <div class="inputWrapper">
              <Checkbox v-model="inputIsadmin"></Checkbox>
            </div>
            <div class="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隐藏：
            </div>
            <div class="inputWrapper">
              <Checkbox v-model="inputDel"></Checkbox>
            </div>
          </div>
        </div>
      </Modal>
      <!-- 删除用户 -->
      <Modal v-model="isShowDeleteBlock" v-bind:title="deleteBlockTitle" @on-ok="deleteBlockOk" @on-cancel="deleteBlockCancel" ok-text="确认" cancel-text="取消">
        <div>{{deleteBlockText}}</div>
      </Modal>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      tableHeight: 0,
      treeData: [],
      tableLoading: false,
      tableTitle: [{
          title: '用户账号',
          key: 'code',
          align: "center"
        },
        {
          title: '用户名称',
          key: 'name',
          align: "center"
        },
        {
          title: '等级',
          key: 'grade',
          align: "center"
        },
        {
          title: '超级用户',
          key: 'isadmin',
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const type = params.row.isadmin ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '隐藏',
          key: 'del',
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const type = params.row.del ? "md-checkmark-circle" : "md-radio-button-off";
            return h('Icon', {
              props: {
                type: type,
                color: "#2d8cf0"
              }
            });
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.changeAttributeTable(params.row, params.index)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteUserSetting(params.row.id, params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      tableData: [],
      isModifyUserSetting: false,
      ModifyUserSettingTitle: "修改用户资料",
      inputCode: "",
      inputName: "",
      inputPassWord: "",
      inputGrade: 0,
      inputIsadmin: "",
      inputDel: "",
      inputID: "",
      inputIndex: "",
      inputTreeCode: "",
      isInsertUserSetting: false,
      isShowDeleteBlock: false,
      deleteBlockText: "是否删除该用户设置",
      deleteBlockTitle: "删除用户设置"
    };
  },
  methods: {
    reloadTree: function() {
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
    renderContent: function(h, { root, node, data }) {
      return h('span', {
        class: 'hoverItem ' + data.title,
        style: {
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        },
        on: {
          click: () => { this.selectTree(root, node, data) }
        }
      }, [
        h('Icon', {
          props: {
            type: 'ios-folder-outline'
          },
          style: {
            marginRight: '8px',
            fontSize: '18px'
          }
        }),
        h('span', data.resource.name)
      ]);
    },
    selectTree: function(root, node, data) {
      console.log(data)
      if (node.nodeKey == 0) {
        return;
      }
      if (this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0]) {
        this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0].className = this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0].className.replace(" active", "");
      }
      this.$refs['userSettingLeftBlock'].getElementsByClassName(data.title)[0].className += ' active';
      var that = this;
      this.tableLoading = true;
      this.inputTreeCode = data.resource.treecode;
      this.axios.get(this.seieiURL + "/syusers/getallbytreecode", {
        params: {
          treeCode: data.resource.treecode
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
    changeAttributeTable: function(data, index) {
      this.isModifyUserSetting = true;
      this.inputCode = data.code;
      this.inputName = data.name;
      this.inputPassWord = data.pw;
      this.inputGrade = data.grade;
      this.inputIsadmin = data.isadmin;
      this.inputDel = data.del;
      this.inputID = data.id;
      this.ModifyUserSettingTitle = "修改用户资料";
      this.isInsertUserSetting = false;
      this.inputIndex = index;
    },
    ModifyUserSettingOk: function() {
      var that = this,
        url;
      if (!this.isInsertUserSetting) {
        url = this.seieiURL + "/syusers/updateusersetting";
      } else {
        url = this.seieiURL + "/syusers/insertusersetting";
      }
      this.axios.get(url, {
        params: {
          code: this.inputCode,
          name: this.inputName,
          pw: this.inputPassWord,
          grade: this.inputGrade,
          isadmin: this.inputIsadmin,
          del: this.inputDel,
          id: this.inputID,
          typecode: this.inputTreeCode
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          if (that.isInsertUserSetting) {
            that.tableData.push({
              code: that.inputCode,
              name: that.inputName,
              pw: that.inputPassWord,
              grade: that.inputGrade,
              isadmin: that.inputIsadmin,
              del: that.inputDel,
              id: response.data.data
            })
          } else {
            that.$set(that.tableData, [that.inputIndex], {
              code: that.inputCode,
              name: that.inputName,
              pw: that.inputPassWord,
              grade: that.inputGrade,
              isadmin: that.inputIsadmin,
              del: that.inputDel,
              id: that.inputID,
              typecode: that.inputTreeCode
            });
          }
        } else {
          that.$Message.error(response.data.msg);
        }
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    ModifyUserSettingCancel: function() {

    },
    deleteUserSetting: function(id, index) {
      this.inputID = id;
      this.inputIndex = index;
      this.isShowDeleteBlock = true;
    },
    deleteBlockOk: function(id) {
      var that = this;
      this.axios.get(this.seieiURL + "/syusers/deleteusersetting", {
        params: {
          id: this.inputID
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          that.tableData.splice(that.inputIndex, 1);
        } else {
          that.$Message.error(response.data.msg);
        }
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    deleteBlockCancel: function() {

    },
    insertUserSetting: function() {
      if (!this.inputTreeCode) {
        this.$Message.error("请点击用户组别！");
      } else {
        this.ModifyUserSettingTitle = "新增用户资料";
        this.isInsertUserSetting = true;
        this.isModifyUserSetting = true;
        this.inputCode = "";
        this.inputName = "";
        this.inputPassWord = "";
        this.inputGrade = 9;
        this.inputIsadmin = false;
        this.inputDel = false;
      }
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["userSettingLeftBlock"].style.height = this.$refs["userSettingRightBlock"].style.height = this.windowHeight - 40 - 49 - 30 + "px";
      this.tableHeight = this.windowHeight - 40 - 49 - 30 - 50;
    });
    this.reloadTree();
  }
}

</script>
<style>
#userSetting-component {
  font-size: 0px;
}

#userSetting-component .userSettingWrapper {
  overflow-y: hidden;
}

#userSetting-component .userSettingLeftBlock,
#userSetting-component .userSettingRightBlock {
  display: inline-block;
  width: 20%;
  padding-left: 5px;
  font-size: 12px;
  border: 1px solid #ddd;
  overflow-y: scroll;
}

#userSetting-component .userSettingRightBlock {
  width: 80%;
  overflow-y: hidden;
}

#userSetting-component .ivu-table-cell {
  padding: 0;
}

.hoverItem.active {
  background-color: #e0ebff
}

.userSetting-component .inputBar {
  margin-top: 20px;
  font-size: 0;
}

.userSetting-component .inputBar .title {
  display: inline-block;
  margin-left: 15px;
  line-height: 40px;
  font-size: 18px;
  vertical-align: top;
}

.userSetting-component .inputBar .titleFirst {
  margin-left: 5px;
}

.userSetting-component .inputBar .inputWrapper {
  display: inline-block;
  margin-left: 5px;
  line-height: 35px;
  font-size: 12px;
  vertical-align: top;
}

</style>
