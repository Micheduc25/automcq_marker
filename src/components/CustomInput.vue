<template>
    <div class="custom-input">
        
        <label class="input-label" :for="id">{{label}}</label>
        
        <input ref="myinput" :required="required" @input="updateInput()" :name="name" :id="id" :type="type" :placeholder="placeholder" :value="value" />
    </div>
</template>

<script>
    export default {
        name:"CustomInput",
        props:{
            value:String,
            type:{
                default:'text',
                type:String
            },
            placeholder:{
                type:String
            },
            required:{
                default:false,
                type:Boolean
            },
           
            name:{
                required:true,
                type:String
            },
            label:{
                default:"",
                type:String
            },
            id:{
                required:true,
                type:String
            }
        },

        methods:{
            updateInput(){
                // console.log("value is ", this.$refs.myinput.value);
                this.$emit("input",this.$refs.myinput.value);
            }
        }
        
    }
</script>

<style lang="css" scoped>
    .custom-input{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        @apply mb-3;
    }
    input:focus{
        outline:none;
    }
    .custom-input input{
        width:100%;
        border:1px solid #2f48ff;
        border-radius:4px;
        padding:10px 10px;
        
    }

    .input-label{
        margin-bottom: 5px;
    }
</style>