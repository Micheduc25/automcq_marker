<template>
    <header class="app-header z-10">
        <div class="app-icon">
           <router-link class="logo-link" style="color:white" to="/"> <img src="@/assets/images/test.png" alt="">UBa MCQ marker</router-link>
        </div>

        <nav class="header-navigation ">
            <div class="nav-wrapper">
                <router-link v-if="$store.getters.isLoggedIn" class="router-link"  to="/dashboard"> Dashboard</router-link>
                <router-link class="router-link" to="/about">About</router-link>
                <div class="more inline-block underline text-white cursor-pointer relative" v-if="$store.getters.isLoggedIn">
                    {{$store.getters.user.username}}
                    <div class="profile-popup rounded-sm w-full shadow-lg p-2 bg-white absolute text-sm z-10">
                        <router-link to="/profile" class="mb-2">Profile</router-link>
                        <button @click="logoutUser">Logout</button>

                    </div>
                </div>
                <router-link  class="router-link" to="/auth/login" v-if="!$store.getters.isLoggedIn">Login</router-link>
                <router-link class="router-link relative" to="/auth/signup" v-if="!$store.getters.isLoggedIn">SignUp</router-link>
            </div>
        </nav>
    </header>
</template>

<script>
    export default {
        name:"AppHeader",

        methods:{
            logoutUser(){
                if(this.$store.getters.user!==null){
                    this.$store.dispatch('logoutUser');
                    if(this.$route.fullPath!=='/'){
                        this.$router.replace('/');
                    }
                    
                }
            }
        },

        created(){
            if(!this.$store.getters.isLoggedIn && this.$store.getters.user){
                this.$store.dispatch('setIsLoggedIn',true);
            }
        }
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
    .router-link{
        color:white;
        padding:10px 20px;
        display: inline-block;
        transition:.4s;
        border-radius:3px;
        text-decoration: underline;
        text-decoration-color: white;
        cursor: pointer;
    }

    .router-link:hover,.router-link-exact-active:not(.logo-link){
        background:white;
        color:#2f48ff !important;
    }

    .router-link:not(:last-child){
        margin-right:30px;
    }
    .profile-popup{
        display: flex;
        flex-direction: column;
        color:black;
        pointer-events: none;
        opacity: 0;
        transition: .3s;
    }

    .more{

    }
    .more:hover .profile-popup{
        pointer-events: all;
        opacity: 1;
        
    }

</style>