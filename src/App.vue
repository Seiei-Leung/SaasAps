<template>
  <div id="app">
      <v-signin v-show="!isSignin"></v-signin>
      <div v-show="isSignin">
        <div class="indexPageWrapper">
          <v-pageHeader></v-pageHeader>
          <div class="content">
            <v-indexContentSplit></v-indexContentSplit>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import signIn from './components/signIn/signIn';
import pageHeader from './components/pageHeader/pageHeader';
import indexContentSplit from './components/indexContentSplit/indexContentSplit';

export default {
  name: 'App',
  data: function() {
    return {

    };
  },
  computed: {
    isSignin: function() {
      return this.$store.state.isSignin;
    }
  },
  components: {
    'v-signin': signIn,
    'v-pageHeader': pageHeader,
    'v-indexContentSplit': indexContentSplit
  }
}
</script>

<style>
#app {

}
</style>
