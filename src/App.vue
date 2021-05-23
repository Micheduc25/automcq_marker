<template>
  <app-header></app-header>
  <router-view class="current-view"/>
</template>

<script>
  import AppHeader from "./components/global/header" ;

export default {
  name:'MCQMarker',
  components:{
    AppHeader
  }
}
</script>


<style>


body{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

.current-view{
  padding:0 15px;
}

a:visited,a{
  color:#000000;
  text-decoration: none;
}


</style>
