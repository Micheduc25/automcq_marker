<template>
    <div id="answer-sheet" ref="sheet" class="sheet-preview sheet-border">
        <div class="sheet-header">
            <h1 class="text-xl font-bold">{{currentSheet.university}}</h1> 
            <h1 v-if="currentSheet.school" class="text-md font-bold">School:{{currentSheet.school}}</h1> 
            <h1 v-if="currentSheet.department" class="text-md font-bold">Department:{{currentSheet.department}}</h1> 
            <h1 v-if="currentSheet.classe" class="text-md font-bold">Class:{{currentSheet.classe}}</h1> 
            <h1 v-if="currentSheet.course" class="text-md font-bold">Course:{{currentSheet.course}}</h1> 
            <h1 v-if="currentSheet.code" class="text-md font-bold">Course Code:{{currentSheet.code}}</h1> 
            <h1 v-if="currentSheet.credit" class="text-md font-bold">Credit Value:{{currentSheet.credit}}</h1> 
            <h1 v-if="currentSheet.instructor" class="text-md font-bold">Instructor:{{currentSheet.instructor}}</h1> 
            <!-- <h1 v-if="currentSheet.credit" class="text-xl font-bold">Credit Value:{{currentSheet.credit}}</h1>  -->
        </div>
        <div class="sheet-body">
            <div class="student-info mt-2 mb-5 flex items-center justify-center">
                <div class="student-name flex flex-col items-start mr-3">
                    <span>Student Name:</span>
                    <div class="name-entry border-2 border-black h-10 w-96"></div>
                </div>
                <div class="student-matricule flex flex-col items-start mr-3 ">
                    <span>Registration Number:</span>
                    <div class="mat-entry border-2 border-black h-10 w-52"></div>
                </div>
                
                <div class="student-code flex flex-col items-start mr-3 ">
                    <span>Code:</span>
                    <div class="code-entry border-2 border-black w-24 h-10"></div>
                </div>
            </div>
            <div class="dash border-b-2 border-dashed border-black mx-1 my-2"></div>
                <!-- student code agent -->
                <div style="width:690px" class="flex justify-end mx-auto w-full">
                    <div class="student-code flex flex-col items-start ">
                        <span>Code:</span>
                        <div class="code-entry border-2 border-black w-24 h-10"></div>
                    </div>
                </div>
                
            <div class="sheet-parts flex justify-evenly">
                <div v-for="part in (is2parts?2:1)" :key="`part${part}`" class="questions-wrapper flex  m-4 p-3 mx-auto">
                    <div class="question-nums  grid items-center mr-2 p-2" :style="`grid-template-rows:repeat(${(is2parts && part==1)?'25': (is2parts && part==2)?`${currentSheet.questions - 25}`:currentSheet.questions},1fr)`">
                        <span class="border-b border-black" v-for="num in parseInt((is2parts && part===1)?'25': (is2parts && part==2)?`${currentSheet.questions-25}`:currentSheet.questions)" :key="`quesn${num}`">
                            Q{{ (is2parts && part==1)?num:(is2parts && part==2)?25+num:num }}
                        </span>
                    </div>
                    <div v-if="currentSheet.questions" :style="`grid-template-rows:repeat(${(is2parts && part==1)?'25': (is2parts && part==2)?`${currentSheet.questions - 25}`:currentSheet.questions},1fr)`" class="sheet-questions border-2 border-black p-2  grid-cols-1">
                        <div v-for="num in parseInt((is2parts && part==1)?'25': (is2parts && part==2)?`${currentSheet.questions - 25}`:currentSheet.questions)" :key="`ques${num}`" class="">
                            <!-- <span>Q{{num}}</span> -->
                            <div class=" flex " >
                                <div v-for="c in parseInt(currentSheet.choices)" :key="`ch${c}`" class="bubble flex items-center mr-4">
                                    <span class="mr-1">{{currentSheet.choiceList[c-1]}}</span>
                                    <div :class="{'rounded-full':currentSheet.bubble=='Circles'}" class="w-6 h-6 border-2 border-black flex-none"></div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
    
    export default {
        name:"SheetPreview",
        data(){
            return {
                is2parts:false
            }
        },
        props:{
            currentSheet:{
                type:Object,
                required:true
            }
        },

        created(){

        },

        mounted(){
            if(parseInt(this.currentSheet.questions)>25)this.is2parts=true;
        }

        
    }
</script>

<style lang="css" scoped>
    .sheet-border{
        border:2px solid black;
    }
    .sheet-preview{
        /* height:700px; */
        width:800px;
        @apply mx-auto;
    }
    .sheet-header{
        padding:20px 15px;
        border-bottom:2px solid black;
    }

    .sheet-questions{
        display:grid;
        grid-template-columns: 1;
        row-gap: 10px;
    }
    .questions-wrapper{
        width:max-content;
        height: max-content;
    }
</style>