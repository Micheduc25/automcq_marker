<template>
  <div class="home">
      <get-started></get-started>
  </div>
</template>

<script>
// @ is an alias to /src
import GetStarted from '../components/GetStarted.vue';
export default {
  name: 'Home',
  components: {
    GetStarted
  }
}
</script>

<style lang="css" scoped>
  .home{
   
  }
</style>
