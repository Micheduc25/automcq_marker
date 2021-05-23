<template>
    <header class="app-header">
        <div class="app-icon">
           <router-link style="color:white" to="/"> <img src="@/assets/images/test.png" alt=""> MCQ marker</router-link>
        </div>

        <nav class="header-navigation ">
            <div class="nav-wrapper">
                <router-link class="router-link"  to="/a"> My Sheets</router-link>
                <router-link class="router-link" to="/b">Students</router-link>
                <router-link class="router-link" to="/c">About</router-link>
            </div>
        </nav>
    </header>
</template>

<script>
    export default {
        name:"AppHeader"
    }
</script>

<style lang="css" scoped>
    .app-header{
        padding:10px 30px;
        /* width:100%; */

        display:flex;
        align-items: center;
        background:#2f48ff; 
        color:white;
        position: sticky;
        top:0;
        @apply shadow-lg;
        

    }

    .header-navigation{
        flex-grow:1;
        
        /* background:yellow; */
    }

    .app-icon a{
        display: flex;
        align-items: center;
    }

    .app-icon img{
        width:40px;
        @apply mr-2;
    }

    .nav-wrapper{
        width:max-content;
        margin-left:auto;
    }
    a.router-link{
        color:white;
        padding:10px 20px;
        transition:.4s;
        border-radius:3px;
    }

    a.router-link:hover{
        background:white;
        color:#2f48ff;
    }

    a.router-link:not(:last-child){
        margin-right:30px;
    }

</style>