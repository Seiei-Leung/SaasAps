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
        <Table v-bind:height="tableHeight" :loading="tableLoading" border :columns="tableTitle" :data="tableData" @on-row-dblclick="clickTable"></Table>
      </div>
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
          title: '助记码',
          key: 'mnemoniccode',
          align: "center"
        },
        {
          title: '可查询月数',
          key: 'querymons',
          align: "center"
        },
        {
          title: '访问范围（按月）',
          key: 'queryscope',
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
          align: "center"
        },
        {
          title: '隐藏',
          key: 'del',
          align: "center"
        },
        {
          title: '工号',
          key: 'employeeno',
          align: "center"
        },
        {
          title: '姓名',
          key: 'employeename',
          align: "center"
        },
        {
          title: '职位',
          key: 'name',
          align: "center"
        },
        {
          title: '组别',
          key: 'name',
          align: "center"
        },
        {
          title: '财务账套',
          key: 'name',
          align: "center"
        }
      ],
      tableData: [],

    };
  },
  methods: {
    reloadTree: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/sygroup/getAll").then((response) => {
        that.treeData = response.data;
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
      if (this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0]) {
        this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0].className = this.$refs['userSettingLeftBlock'].getElementsByClassName('active')[0].className.replace(" active", "");
      }
      this.$refs['userSettingLeftBlock'].getElementsByClassName(data.title)[0].className += ' active';
      var that = this;
      this.tableLoading = true;
      this.axios.get(this.seieiURL + "/syusers/getallbytreecode", {
        params: {
          treeCode: data.resource.treecode
        }
      }).then((response) => {
        that.tableLoading = false;
        that.tableData = response.data;
      }).catch((error) => {
        that.tableLoading = false;
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
      // console.log(root);
      // console.log(node);
      // console.log(data);
    },
    clickTable: function() {

    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["userSettingLeftBlock"].style.height = this.$refs["userSettingRightBlock"].style.height = this.windowHeight - 40 - 49 - 30 + "px";
      this.tableHeight = this.windowHeight - 40 - 49 - 30;
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
</style>
