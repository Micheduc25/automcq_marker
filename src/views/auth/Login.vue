<template>
    <div class="login-page">

        <form @submit.prevent="loginUser" autocomplete="on" class="login-form w-7/12 shadow-lg p-4 mx-auto mt-10">
            <h1 class="font-bold text-2xl mb-6">Login</h1>
            <custom-input label="Username" id="username" name="username" :errorMsg="formErrors.usernameError" placeholder="Enter username" v-model="formData.username" />
            <custom-input type="password" id="password" name="password" :errorMsg="formErrors.passwordError"  label="Password" placeholder="Enter password" v-model="formData.password" />
            <div class="remeber-me">
                <label for="remember-me" class="flex items-center justify-center">Remember Me <input v-model="formData.rememberMe" name="remember-me" id="remember-me" type="checkbox" class="w-5 h-5 ml-2"></label>
            </div>

            <input type="submit" value="Login"  class="focus:outline-none mt-4 bg-blue-600 text-white px-10 py-4 mb-3"/>
             <div>
                <span class="text-xs"> No account yet? <router-link to="/auth/signup" class=" underline text-blue-500"> Register</router-link></span>

            </div>
        </form>

    </div>
</template>

<script>
import CustomInput from '../../components/CustomInput.vue'
    
    export default {
        name:"Login",
        components: { CustomInput },

        data(){
            return {
                isLoading:false,
                formData:{
                    username:'',
                    password:'',
                    rememberMe:false
                },
                formErrors:{
                    usernameError:'',
                    passwordError:''
                }
            }
        },

        methods:{
            async loginUser(){
                let isCredentialsValid = true;
                if(this.formData.password.length<6){
                    this.formErrors.passwordError='Password should be Atleast 6 characters';
                    isCredentialsValid = false;
                }
                else this.formErrors.passwordError='';

                if(this.formData.username.length===0){
                    this.formErrors.usernameError="Username field should not be empty";
                    isCredentialsValid = false;
                }
                else this.formErrors.usernameError = '';

                if(isCredentialsValid){
                    const loader = this.$loading.show();
                    try{
                        const res = await this.$store.dispatch('login',this.formData);
                        localStorage.setItem('auth-token', res.token );

                        // if(this.formData.rememberMe){
                        //     //if remember me is set to true we save the auth token for the user and the user object
                        //     localStorage.setItem('auth-token', res.token );
                        //     // localStorage.setItem('user', res.user );
                        // }
                        this.formData.username = '';
                        this.formData.password = '';
                        this.formData.rememberMe = false;
                        if(this.$route.query.nextUrl){
                            await this.$router.replace(`${this.$route.query.nextUrl}`);

                        }
                        else{
                           await this.$router.replace('/dashboard');
                        }
                    }
                    catch(err){
                        this.$swal({
                            title:'Login Error',
                            text:`${err?err.toString():'An unknown error occured'}`,
                            showCloseButton: true,
                            icon:'error'
                        })
                    }
                    loader.hide();
                }
                
            }
        },


        created(){
             console.log(this.$route.query);
            if(Object.keys(this.$route.query).length>0){
                this.formData.username = this.$route.query.username;
            }
        }

        
    }
</script>

<style lang="css" scoped>
    #remember-me{
        border:1px solid #2f48ff;
    }
    #remember-me:checked{
        background:#2f48ff;
    }
</style>