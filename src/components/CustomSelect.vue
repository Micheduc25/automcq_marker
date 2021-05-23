<template>
    <div class="custom-input">
        
        <label class="input-label" :for="id">{{label}}</label>
        
        <select ref="myinput" :required="required" @input="updateInput()" :name="name" :id="id"  :value="value" >
            <option v-for="opt in options" :value="opt" :key="`${opt}select`">
                {{opt}}
            </option>
        </select>
    </div>
</template>

<script>
    export default {
        name:"CustomSelect",
        props:{
            value:String,
            
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

            options:{
                type:Array,
                default:()=>[]
            }
        },

        methods:{
            updateInput(){
                console.log("value is ", this.$refs.myinput.value);
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
    select:focus{
        outline:none;
    }
    .custom-input select{
        width:100%;
        border:1px solid #2f48ff;
        border-radius:4px;
        padding:10px 10px;
        
    }

    .input-label{
        margin-bottom: 5px;
    }
</style>