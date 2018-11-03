<template>
  <div id="indexContextSplit-component">
    <div class="splitWrapper" ref="splitWrapper">
      <Split v-model="splitPercent" min="200px" max="1000px">
        <div slot="left">
          <div class="left-split-pane">
            <div class="closeBtn" @click="closeLeftBlock">
              <Icon type="ios-arrow-back" v-show="splitPercent != 0" />
              <Icon type="ios-arrow-forward" v-show="splitPercent == 0" />
            </div>
            <div class="leftBlock" ref="leftBlock">
              <Menu :theme="theme" width="100%" accordion @on-select="openTag">
                <Submenu name="1">
                  <template slot="title">
                    <Icon type="ios-paper" />
                    权限管理
                  </template>
                  <MenuItem name="1-1">用户设置</MenuItem>
                  <MenuItem name="1-2">权限设置</MenuItem>
                  <MenuItem name="1-3">用户组别</MenuItem>
                </Submenu>
                <Submenu name="2">
                  <template slot="title">
                    <Icon type="ios-people" />
                    参数设置
                  </template>
                  <MenuItem name="2-1">颜色设置</MenuItem>
                  <MenuItem name="2-2">图标设置</MenuItem>
                </Submenu>
                <Submenu name="3">
                  <template slot="title">
                    <Icon type="ios-stats" />
                    基础设置
                  </template>
                  <MenuItem name="3-1">生产设置</MenuItem>
                  <MenuItem name="baseSetting-calender">工厂日历</MenuItem>
                  <MenuItem name="3-3">排产品类</MenuItem>
                </Submenu>
                <Submenu name="4">
                  <template slot="title">
                    <Icon type="ios-people" />
                    排产管理
                  </template>
                  <MenuItem name="4-1">走货一览表</MenuItem>
                  <MenuItem name="4-2">排产器</MenuItem>
                </Submenu>
                <Submenu name="5">
                  <template slot="title">
                    <Icon type="ios-people" />
                    报表查询
                  </template>
                  <MenuItem name="5-1">生产排期查询</MenuItem>
                  <MenuItem name="5-2">SAH每月查询</MenuItem>
                </Submenu>
              </Menu>
            </div>
          </div>
        </div>
        <div slot="right">
          <div class="right-split-pane">
            <div class="rightBlock" ref="rightBlock">
              <Tabs type="card" closable @on-tab-remove="handleTabRemove" :value="activeTab">
                <!-- 工厂日历 -->
                <TabPane label="工厂日历" v-if="isShow.baseSetting.calender" name="baseSetting-calender">
                  <v-factoryCalendar></v-factoryCalendar>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Split>
    </div>
  </div>
</template>
<script>
import factoryCalendar from "../factoryCalendar/factoryCalendar";

const headerBarHeight = 40;

export default {
  data: function() {
    return {
      splitPercent: 0.2, // 左右侧初始化比例
      theme: "light", // 左侧栏主题颜色
      // 显示兑现
      isShow: {
        // 基础设置
        baseSetting: {
          calender: false // 工厂日历
        }
      },
      activeTab: ""
    }
  },
  methods: {
    // 左侧栏关闭按钮事件
    closeLeftBlock: function() {
      this.splitPercent == 0 ? this.splitPercent = 0.2 : this.splitPercent = 0;
    },
    // 左侧栏项目点击显示事件
    openTag: function(name) {
      var
        list = name.split("-"),
        classification = list[0],
        detail = list[1];
      this.isShow[classification][detail] = true;
      this.activeTab = name;
    },
    // 分页栏关闭事件
    handleTabRemove: function(name) {
      var
        list = name.split("-"),
        classification = list[0],
        detail = list[1];
      this.activeTab = "";
      this.isShow[classification][detail] = false;
    },
  },
  created: function() {
    // 初始化页面
    this.$nextTick(() => {
      // 定高度值
      this.$refs.splitWrapper.style.height = this.windowHeight - headerBarHeight + "px";
      this.$refs.leftBlock.style.height = this.windowHeight - headerBarHeight + "px";
      this.$refs.rightBlock.style.height = this.windowHeight - headerBarHeight + "px";
    });
  },
  components: {
    'v-factoryCalendar': factoryCalendar
  }
}

</script>
<style>
#indexContextSplit-component .splitWrapper {
  height: 200px;
  border-bottom: 1px solid #dcdee2;
}

#indexContextSplit-component .splitWrapper .leftBlock {
  position: relative;
  overflow-y: scroll;
}

#indexContextSplit-component .splitWrapper .closeBtn {
  position: absolute;
  right: -20px;
  top: 40%;
  width: 15px;
  height: 100px;
  line-height: 100px;
  border: 1px solid #ddd;
  text-align: center;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #fff;
  z-index: 1
}

#indexContextSplit-component .splitWrapper .closeBtn:hover {
  background-color: #eee
}

#indexContextSplit-component .splitWrapper .rightBlock {
  box-sizing: border-box;
  width: 100%;
  padding: 1px 0 0 7px;
}

/* 修正 */
#indexContextSplit-component .splitWrapper .ivu-menu-submenu-title {
  border-bottom: 1px solid #dcdee2;
}

#indexContextSplit-component .splitWrapper .ivu-menu-vertical.ivu-menu-light:after {
  width: 0
}

#indexContextSplit-component .splitWrapper .ivu-menu-item {
  background-color: #fbfbfb
}

#indexContextSplit-component .splitWrapper .ivu-menu-item:hover {
  background-color: #eee
}

#indexContextSplit-component .splitWrapper .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: #e0ebff;
}

.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
	color: #565656;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
