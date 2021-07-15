<template>
    <div class="custom-checkboxgroup flex items center">
        
        <div class="mr-3 flex items-center" v-for="(opt,index) in options" :key="`${id}option${index}`">
            <label class="input-label mr-1" :for="id">{{opt}}</label>
            
            <input
                ref="myinput" class="w-4 h-4" 
                :checked="modelValue&&modelValue.includes(opt)?true:false" 
                @change="updateInput($event.target.checked,opt)" 
                type="checkbox" :name="name+index" :id="id+index" 
            />
        </div>
    </div>
</template>

<script>
    export default {
        name:'CheckboxGroup',
        emits:["update:modelValue","valuesChanged"],
        data(){
            return {
                selectedOptions:{}
            }
        },

        props:{
            modelValue:String,

            options:{
                type:Array,
                required:true
            },
            name:{type:String, required:true},
            id:{type:String, required:true},
        },

        methods:{
            updateInput(value,opt){
                this.selectedOptions[opt]=value;
                let selected = [];
                for(let key of Object.keys(this.selectedOptions)){
                    if(this.selectedOptions[key]){
                        selected.push(key);
                    }
                    
                }
                // console.log(selected);
                this.$emit("update:modelValue",selected.join(' '));
                this.$emit("valuesChanged",selected);
            }
        },
        watch:{
            modelValue(newVal,oldVal){
                if(oldVal===undefined&&newVal!==undefined){
                    let valuesArray = this.modelValue.split(' ');
                    for(let val of valuesArray){
                        this.selectedOptions[val]=true;
                    }
                }
            }
        },
        created(){

            for (let index in this.options){
                 this.selectedOptions[this.options[index]]=false;
            }
            if(this.modelValue){
                    let valuesArray = this.modelValue.split(' ');
                    for(let val of valuesArray){
                        this.selectedOptions[val]=true;
                    }
                }

        }
    }
</script>

<style lang="scss" scoped>

</style>