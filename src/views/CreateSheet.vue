<template>
    <div class="create-sheet">
        <h1 class="mb-4">Create your custom answer sheet by filling in the form below</h1>

        <form class="create-form" action="">
            <div class="step1" v-show="step==1">
                  
                <h3 class="text-center text-xl font-bold @apply mb-2">Pleliminary Information</h3>
                <custom-input placeholder="University name" label="University" v-model="formData.university" name="university" id="university"/>
                <custom-input placeholder="School name" label="School" v-model="formData.school" name="school" id="school"/>
                <custom-input placeholder="Department name" label="Department" v-model="formData.department" name="department" id="department"/>
                <custom-input placeholder="Class name" label="Class" v-model="formData.class" name="class" id="class"/>

            </div>
            <div class="step2" v-show="step==2">
                  
                <h3 class="text-center text-xl font-bold @apply mb-2">Course Information</h3>
                <custom-input placeholder="Course name" label="Course" v-model="formData.course" name="course" id="course"/>
                <custom-input placeholder="Course code" label="Code" v-model="formData.code" name="code" id="code"/>
                <custom-input placeholder="Course credit value" label="Credit Value" v-model="formData.credit" name="credit" id="credit"/>
                <custom-input placeholder="Instructor name" label="Instructor" v-model="formData.instructor" name="instructor" id="instructor"/>

            </div>

            <div class="step3" v-show="step==3">
                  
                <h3 class="text-center text-xl font-bold @apply mb-2">Sheet Description</h3>
                <custom-select  label="Bubble Type" v-model="formData.bubble" name="bubble-type" id="bubble-type" :options="['Square', 'Circle']"/>
                <custom-select required  label="Number of Questions" v-model="formData.questions" name="questions" id="questions" :options="['10', '20', '30', '40', '50']"/>
                <custom-select required  label="Number of Choices" v-model="formData.choices" name="choices" id="choices" :options="['2', '3', '4', '5']"/>
                <custom-select label="Choices Labels" v-model="formData.choiceLabels" name="choices-labels" id="choices-labels" :options="['A-B-C', 'i-ii-iii', '1-2-3']"/>

            </div>
            <div>{{formData.school}}</div>
            <!-- <custom-input type="date" /> -->

            <div class="nav-but flex justify-end">
                <button @click.prevent="prevStep()" :class="{'bg-gray-400':step==1,'bg-blue-600':step!=1}" class="focus:outline-none  px-8 py-2 rounded-sm text-white mr-2">Prev</button>
                <button @click.prevent="nextStep()" :class="{'bg-gray-400':step==4,'bg-blue-600':step!=4}" class=" focus:outline-none px-8 py-2 rounded-sm text-white">Next</button>
            </div>
        </form>
    </div>
</template>

<script>
    import CustomInput from '../components/CustomInput.vue';
    import CustomSelect from "../components/CustomSelect";
    export default {
        name:"CreateSheet",
        components:{
            CustomInput,
            CustomSelect,
        },
        data(){
            return {
                step:1,
                formData:{
                    university:"",
                    school:"",
                    department:"",
                    class:"",
                    course:"",
                    code:"",
                    credit:0,
                    instructor:"",
                    bubble:"Square"

                }
            }
        },

        methods:{
            nextStep(){
                console.log("next!")
                if(this.step<4)this.step++;
            }
            ,
            prevStep(){
                if(this.step>1)this.step--;
            }
        }
    }
</script>

<style lang="css" scoped>
    .create-sheet{
        padding:30px 0;
    }
    .create-form{
        padding:15px 30px;
        max-width:65%;
        margin:0 auto;
        border:1px solid #2f48ff;
        border-radius: 4px;
        @apply shadow-lg
    }
</style>