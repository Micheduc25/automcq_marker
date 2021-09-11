<template>
  <input
      ref="myinput"
      :value="modelValue"
      :required="required"
      @input="updateInput($event.target.value)"
      :name="name"
      :id="id"
      type="number"
      :placeholder="placeholder"
      :min="numMin"
      :max="numMax"
  />

</template>

<script>
export default {
  name: "MarkInput",
    props:{
      modelValue:String,
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
      choice:{
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
      numMin:{type:Number, default:0},
      numMax:{type:Number, default:100}
    },
    emits:["update:modelValue"],

  methods: {
    updateInput(val) {
      this.$emit("update:modelValue", `${this.choice} ${val.toString()}`);
    }
  }

}
</script>

<style scoped>

</style>