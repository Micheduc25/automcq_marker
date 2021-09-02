<template>
    <div class="create-sheet">
        <h1 class="mb-4">Create your custom answer sheet by filling in the form below</h1>

        <form class="create-form overflow-y-auto" action="">

            <!-- this is step 1 -->
            <div class="step1" v-show="step==1">
                  
                <h3 class="text-center text-xl font-bold @apply mb-2">Pleliminary Information</h3>
                <custom-input placeholder="Enter unique sheet name" label="Sheet Name" :required="true" v-model="formData.sheet_name" name="sheetname" id="sheetname"/>
                <custom-input placeholder="University name" label="University" v-model="formData.university" name="university" id="university"/>
                <custom-input placeholder="School name" label="School" v-model="formData.school" name="school" id="school"/>
                <custom-input placeholder="Department name" label="Department" v-model="formData.department" name="department" id="department"/>
                <custom-input placeholder="Class name" label="Class" v-model="formData.classe" name="class" id="class"/>

            </div>

            <!-- this is step 2 -->
            <div class="step2" v-show="step==2">
                  
                <h3 class="text-center text-xl font-bold @apply mb-2">Course Information</h3>
                <custom-input placeholder="Course name" label="Course" v-model="formData.course" name="course" id="course"/>
                <custom-input placeholder="Course code" label="Code" v-model="formData.code" name="code" id="code"/>
                <custom-input placeholder="Course credit value" label="Credit Value" v-model="formData.credit" name="credit" id="credit"/>
                <custom-input placeholder="Instructor name" label="Instructor" v-model="formData.instructor" name="instructor" id="instructor"/>

            </div>

            <!-- this is step 3 -->
            <div class="step3" v-show="step==3">
                  
                <h3 class="text-center text-xl font-bold @apply mb-2">Sheet Description</h3>
                <custom-select  label="Bubble Type" v-model="formData.bubble"  name="bubble-type" id="bubble-type" :options="['Squares', 'Circles']"/>
                <custom-select  required label="Number of Questions" v-model="formData.questions" @changed="onQuestionsChanged" name="questions" id="questions" :options="['5','10', '20','25', '30', '40', '50']"/>
                <custom-select required label="Number of Choices" v-model="formData.choices"  name="choices" id="choices" :options="['2', '3', '4', '5']"/>
                <custom-select label="Choices Labels" v-model="formData.choiceLabels"  name="choices-labels" id="choices-labels" :options="['A-B-C', 'i-ii-iii', '1-2-3']"/>
                <custom-input 
                    v-model="formData.failMark" 
                    :required="true"
                    class=""
                    label="Fail Mark" 
                    :id="`fail-mark`" 
                    :name="`fail-mark`" 
                    placeholder="Fail mark value"
                    type="number"
                    
                    />

            </div>

            <!-- this is step 4 -->
            <div class="step4" v-show="step==4 && formData.questions && formData.choices">
                <h3 class="text-center text-xl font-bold @apply mb-3">
                    Correct Answers and Remarks
                </h3>

                <div class="qs flex items-center  mb-3 mx-auto" v-for="num in parseInt(formData.questions)" :key="`Q${num}`">
                    <div class="mr-2">Q{{num}}</div>

                    <checkbox-group @valuesChanged="chkdAnswersChanged($event,num)" v-model="correctAnswers[`${num}`]"  :options="generateChoicesOptions()" :id="`ansopts${num}`" :name="`ansopts${num}`" />
                    
                    <div class="marks-distribution flex items-center">
                        <custom-input 
                        v-model="markAllocation[`${num}`]" 
                        type="number" 
                        label="Mark(s)"  
                        :id="`q${num}-mark`" 
                        :name="`q${num}-mark`" 
                        placeholder="Enter Mark" 
                        class="mr-3 mark-input"
                        :required="true"
                        
                        />

                        <!-- we produce boxes to specify the percentage value for each answer for a question -->
                       <template v-if="correctAnswers[`${num}`] && answersPercentages[`${num}`]">
                            <div class="percentage flex items-center mr-2" 
                            v-for="(ans,index) in correctAnswers[`${num}`].split(' ')" 
                            :key="`${num}perdiv${index}`">
                                <span>{{ans}}%</span>
                                <input type="number" 
                                :name="`percent${num}${index}`" 
                                :id="`percent${num}${index}`" 
                                :required="true"
                                v-model="answersPercentages[`${num}`][`${ans}`]"
                                :min="0" :max="100">
                            </div>
                        </template>

                    </div>
                    
<!-- 
                    <custom-input 
                    v-model="answersRemarks[`${num}`]" 
                    class="flex-grow"
                    label="Remarks" 
                    :id="`q${num}-remark`" 
                    :name="`q${num}-remark`" 
                    placeholder="Enter remarks about this answer"
                    
                    /> -->

                </div>
            </div>
            <!-- <div>{{formData.questions}}</div> -->

            <div  class="nav-but flex justify-end">
                <button @click.prevent="prevStep()" :class="{'bg-gray-400':step==1,'bg-blue-600':step!=1}" class="focus:outline-none  px-8 py-2 rounded-sm text-white mr-2">Prev</button>
                <button v-show="step<4" @click.prevent="nextStep()" :class="{'bg-gray-400':step==4,'bg-blue-600':step!=4}" class=" focus:outline-none px-8 py-2 rounded-sm text-white">Next</button>
                <button v-show="step===4" @click.prevent="validateForm"  class=" focus:outline-none px-8 py-2 rounded-sm text-white bg-blue-600">{{isEditMode?'Save':'Validate'}}</button>
            </div>
            
        </form>
    </div>
</template>

<script>
    import CustomInput from '../components/CustomInput.vue';
    import CustomSelect from "../components/CustomSelect";
    import CheckboxGroup from "../components/CheckboxGroup.vue";

    import {mapGetters,mapActions} from 'vuex';
    export default {
        name:"CreateSheet",
        components:{
            CustomInput,
            CustomSelect,
            CheckboxGroup
        },
        data(){
            return {
                step:1,
                letters:['A','B','C','D','E'],
                roman:['i','ii','iii','iv','v'],
                numeric:['1','2','3','4','5'],
                inMounted:true,
                isEditMode:false,
                correctAnswers:{},
                answersRemarks:{},
                markAllocation:{},
                answersPercentages:{},

                formData:{
                    university:"",
                    school:"",
                    department:"",
                    classe:"",
                    course:"",
                    code:"",
                    credit:"",
                    instructor:"",
                    bubble:"Circles",
                    questions:"10",
                    choices:"4",
                    choiceLabels:"A-B-C",
                    failMark:"0",
                    sheet_name:""
                },          

            }
        },

        computed:{
            ...mapGetters(['isFirstrun','currentSheet'])
        },

        methods:{
            ...mapActions(['setCurrentSheet','createQuiz']),
            nextStep(){
                // console.log("next!")
                if(this.step<4)this.step++;
                
            }
            ,
            
            prevStep(){
                if(this.step>1)this.step--;
            },

            
            generateChoicesOptions(){
                const choiceNums = parseInt(this.formData.choices);
                if(this.formData.choiceLabels==="A-B-C"){
                    return this.letters.slice(0,choiceNums);
                }
                else if(this.formData.choiceLabels==="i-ii-iii"){
                    return this.roman.slice(0,choiceNums);
                }
                else {
                    return this.numeric.slice(0,choiceNums);
                }
            },

            onQuestionsChanged(val){

                if(val!== this.formData.questions || this.inMounted){
                    const defaultVal = this.generateChoicesOptions()[0];

                    this.correctAnswers = {};
                    this.answersRemarks = {};
                    this.markAllocation = {};
                    this.answersPercentages = {};

                    for(let i=1; i<=parseInt(val);i++){

                        this.correctAnswers[`${i}`] = defaultVal;
                        this.answersRemarks[`${i}`] = "no remark";
                        this.markAllocation[`${i}`] = "1";
                        this.answersPercentages[`${i}`]={};
                        this.answersPercentages[`${i}`][defaultVal]="100";
                    }
                    console.log(this.answersPercentages);
                }
            },

            chkdAnswersChanged(values,question){
                //when the checked answers for a question changes, we reinitialize its percentages
                this.answersPercentages[`${question}`] = {};
                 const averagePercentage = (100 /values.length).toFixed(1);
                for(let val of values) {                 
                    this.answersPercentages[`${question}`][val] = `${averagePercentage}`;                   
                    }
            },

            async validateForm(){

                if(this.formData.sheet_name==="" || this.formData.failMark===""){
                     this.$swal({
                        icon:'error',
                        title:'Form Error',
                        text:`Please fill the required fields(*) and retry`,
                        showCloseButton:true
                    })
                }
                else{

                    this.formData.correctAnswers = Object.values(this.correctAnswers);

                    //total mark for each question
                    this.formData.marksAllocation = Object.values(this.markAllocation);

                    this.formData.remarks = Object.values(this.answersRemarks);

                    this.formData.choiceList= this.generateChoicesOptions();
                    
                    //how marks are shared amongst correct answers for each question
                    this.formData.marksDistribution = [];
                    const markPercentages = Object.values(this.answersPercentages);       
                    for(let dist of markPercentages){
                        let temp = [];
                        for(let key of Object.keys(dist)){
                            temp.push(`${key} ${dist[key]}`);
                        }
                        this.formData.marksDistribution.push(`${temp.join(';')}`);
                    }
                    console.log(this.formData.marksDistribution);


                    const loader = this.$loading.show();
                    try{
                        let newSheet;
                        if(!this.isEditMode){
                            newSheet = await this.createQuiz(this.formData);
                        }
                        else{
                        newSheet = await this.$store.dispatch('editQuiz',{id:this.formData.id,editData:this.formData})
                        }
                        this.$swal({
                            toast:true,
                            text:`Sheet ${!this.isEditMode?'created':'modified'} successfully`,
                            icon:'success',
                            timer:5000,
                            showConfirmButton:false
                        })

                        console.log(newSheet);
                        this.$router.push( `/view-sheet/${newSheet.id}`);

                    }
                    catch(err){
                        console.log(err.data.error);
                        this.$swal({
                            icon:'error',
                            title:'Error',
                            text:`Unable to ${!this.isEditMode?'create':'modify'} Sheet:`+(err.data.error||err.data),
                            showCloseButton:true
                        })
                    }
                    loader.hide();

                }
                
            }
        },

        created(){
            
            if(this.$route.query.mode==='edit')this.isEditMode=true;

            //if we are in edit mode we set the values of the form fields to the current values of the sheet model
            if(this.isEditMode && this.$route.query.sheetid){
                const loader = this.$loading.show();
                this.$store.dispatch('getQuiz',this.$route.query.sheetid).then(
                    res=>{
                        
                        this.formData = {...res, choices:res.choices.toString(),
                         questions:res.questions.toString(), credit:res.credit.toString(), failMark:res.failMark.toString() };

                        for(let i=0; i<parseInt(this.formData.questions); i++){
                            this.answersRemarks[`${i}`]= this.formData.remarks[i];
                            this.correctAnswers[`${i}`] = this.formData.correctAnswers[i];
                            this.markAllocation[`${i}`] = this.formData.marksAllocation[i];  
                            
                            
                        }

                        let i = 0;
                        for (let dist of this.formData.marksDistribution){
                            let dist_map = {}
                            const dist_splitted = dist.split(";")
                            for (let val of dist_splitted){
                                const ans = val.split(" ")[0]
                                const percentage = val.split(" ")[1]
                                dist_map[ans] = percentage
                            }

                            this.answersPercentages[`${i}`] = dist_map
                            i++;
                            }
                        console.log(this.answersPercentages)
                    }
                    
                    ).catch(err=>{
                        this.$swal({
                        icon:'error',
                        title:'Error',
                        text:"Unable to load Sheet:"+err.toString(),
                        showCloseButton:true
                    })
                    }).finally(()=>{
                        loader.hide();
                    })
            }
        },

        mounted(){
            if(!this.isEditMode){
                this.onQuestionsChanged("10");
                this.inMounted=false;
            }
        }

        
    }
</script>

<style lang="css" scoped>
    .create-sheet{
        padding:30px 0;
    }
    .percentage input{
        width:60px;
        height:auto;
        padding:3px 2px;
        border:1px solid #2f48ff;
    }
    .percentage input:focus{
        outline:none;
    }
    .mark-input{
        width:90px;
    }
    .create-form{
        padding:15px 30px;
        max-width:65%;
        margin:0 auto;
        border:1px solid #2f48ff;
        border-radius: 4px;
        @apply shadow-lg
    }

    .step4{
        width:max-content;
        @apply mx-auto;
    }

    @media only screen and (max-width:1150px){
        .create-form{
            max-width:80%;

        }
    }


    

    /* .step4{
        max-height:80vh;
    } */
</style>