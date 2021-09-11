<template>
    <div class="signup-page">

        <form class="signup-form w-7/12 shadow-lg p-4 mx-auto my-10">
            <h1 class="font-bold text-2xl mb-4">Register</h1>
            <custom-input label="Username" required id="username" name="username" :errorMsg="formErrors.usernameError" placeholder="Enter username" v-model="formData.username" />
            <custom-input label="Email" required id="email" type="email" name="email" :errorMsg="formErrors.emailError" placeholder="Enter email" v-model="formData.email" />
            <custom-input type="password" required id="password" name="password" :errorMsg="formErrors.passwordError"  label="Password" placeholder="Enter password" v-model="formData.password" />
            <custom-input type="password" required id="confirm-password" name="confirm-password" :errorMsg="formErrors.conpasswordError"  label="Confirm Password" placeholder="Enter password again" v-model="formData.confirmpassword" />

            <input @click.prevent="registerUser" type="submit" value="Signup"  class="focus:outline-none mt-4 bg-blue-600 text-white px-10 py-4 mb-3"/>

            <div>
                <span class="text-xs"> Already have an account? <router-link to="/auth/login" class=" underline text-blue-500"> Login</router-link></span>

            </div>

        </form>

    </div>
</template>

<script>
import CustomInput from '../../components/CustomInput.vue'
    
    export default {
        name:"SignUp",
        components: { CustomInput },

        data(){
            return {
                isLoading:false,
                formData:{
                    username:'',
                    password:'',
                    confirmpassword:'',
                    email:''
                },
                formErrors:{
                    usernameError:'',
                    passwordError:'',
                    conpasswordError:'',
                    emailError:''
                }
            }
        },

        methods:{
            async registerUser(){
                let isCredentialsValid = true;
                if(this.formData.password.length<6){
                    this.formErrors.passwordError='Password should be Atleast 6 characters';
                    isCredentialsValid = false;
                }
                else this.formErrors.passwordError='';


                if(this.formData.confirmpassword.length<6){
                    this.formErrors.conpasswordError='Password should be Atleast 6 characters';
                    isCredentialsValid = false;
                }
                else this.formErrors.conpasswordError='';


                if(this.formData.password !== this.formData.confirmpassword){
                    this.formErrors.conpasswordError='The two passwords do not match';
                    this.formErrors.passwordError='The two passwords do not match';
                    isCredentialsValid = false;
                }
                else {this.formErrors.passwordError=''; this.formErrors.conpasswordError='';}



                if(this.formData.username.length==0){
                    this.formErrors.usernameError="Username field should not be empty";
                    isCredentialsValid = false;
                }
                else this.formErrors.usernameError='';


                if(! /.+@.+\..+/.test(this.formData.email)){
                    this.formErrors.emailError = "Email should have format 'random@random.xxx'";
                    isCredentialsValid=false;
                }
                else this.formErrors.emailError='';


                if(isCredentialsValid){
                    
                    const loader = this.$loading.show();
                    try{
                    const user = await this.$store.dispatch('signup',this.formData);
                    this.formData = {
                            username:'',
                            password:'',
                            confirmpassword:'',
                            email:''
                        }

                        this.$router.replace(
                            {
                                path:'/auth/login',
                                query:{username:user.username}
                            })
                    }
                    catch(err){
                        this.$swal({
                            title:'Registration Error',
                            text:`${err}`,
                            showCloseButton: true,
                            icon:'error'
                        })
                    }
                    loader.hide();
                }
                
            }
        }

        
    }
</script>

<style lang="scss" scoped>

</style>