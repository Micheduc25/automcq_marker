<template>
    <div class="custom-input">
        
        <label class="input-label" :for="id">{{label}}</label>
        
        <input ref="myinput" :value="modelValue" :required="required" @input="updateInput($event.target.value)" :name="name" :id="id" :type="type" :placeholder="placeholder" :min="numMin"  />
        <span v-if="errorMsg" class="text-red-500 text-xs">{{errorMsg}}</span>
    </div>
</template>

<script>
    export default {
        name:"CustomInput",
        props:{
            modelValue:String,
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
            },
            errorMsg:{type:String, default:''},
            numMin:{type:Number, default:1}
        },
        emits:["update:modelValue"],

        methods:{
            updateInput(val){
                this.$emit("update:modelValue",val.toString());
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
   .custom-input input:focus{
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