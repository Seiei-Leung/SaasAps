<template>
  <div id="userGroup-component">
    <div class="userGroupWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <Tree :data="treeData" :render="renderContent"></Tree>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      treeData: [],
      buttonProps: {
        type: 'default',
        size: 'small',
      }
    }
  },
  methods: {
    reloadMainTable: function() {
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
    renderContent(h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span',  [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            width: '400px',
            paddingLeft: '24px',
            borderLeft: '1px solid #666'
          }
        }, [
          h('span', {
          	style: {
            	display: 'inline-block',
          		marginRight: '80px',
          		width: '100px'
          	}
          }, data.resource.name),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px',
              marginBottom: "2px"
            },
            on: {
              click: () => { this.append(data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            style: {
            	marginBottom: "2px"
            },
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ]);
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: 'appended node',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - 40 - 49 + "px"
    });
    this.reloadMainTable();
  }
}

</script>
<style>
.ivu-tree ul li {
	margin: 0;
	border: 1px solid #666;
	line-height: 25px;
}
</style>
