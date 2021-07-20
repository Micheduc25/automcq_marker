<template>
    <div class="sheets-view">
        <div v-for="quiz in quizes" @click="showSheetPreview(quiz)" :key="`quiz-${quiz.id}`" class="sheet-card shadow-lg rounded-md overflow-hidden">
            <div class="img-div">
                <img src="@/assets/images/ans-sheet.png" alt="sheet image">
            </div>
            <div class="flex justify-center bg-blue-500 text-white w-full py-4 px-2">
                <div style="width:max-content;" class="mx-auto text-left">
                    <div>{{quiz.sheet_name}}</div>
                    <div class="text-sm text-gray-300">{{quiz.created.split('T')[0]}}</div>
                </div>
            </div>
           
        </div>

        <div v-if="!quizes||quizes.length===0" class="no-quiz">
            <h1>No Quiz has been created yet. Click the "Create Sheet" button to create a sheet</h1>
        </div>

        <router-link to="create-sheet" class="floating">
            Create Sheet
        </router-link>
    </div>
</template>

<script>

    export default {

        name:"SheetsView",
        data(){
            return {
                quizes:null,
               
            }
        },

        methods:{

            async showSheetPreview(quiz){
                const choice_list = await this.$store.dispatch('generateChoicesOptions',quiz);
                let previewObj = {...quiz, choiceList:choice_list};
                this.$store.dispatch('setCurrentSheet',previewObj);

                this.$router.push(`/view-sheet/${previewObj.id}`);
            }
        },
        created(){
            const loader = this.$loading.show();
            this.$store.dispatch('getQuizList').then(quizes=>{
                this.quizes = quizes;
                
            })
            .catch(()=>{
                this.$swal({
                            title:'Eror',
                            text:`Could not load quizes`,
                            showCloseButton: true,
                            icon:'error'
                        })
            }).finally(()=>{
                loader.hide();
            })
        },

        watch:{
            "$store.getters.token":function(newVal){
                console.log("token!",newVal)
            }
        }
    }
</script>

<style lang="css" scoped>
    .sheets-view{
        display:grid;
        grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));
        column-gap:10px;
        row-gap:10px;
        align-items: flex-start;
        min-height: calc(100vh - 80px);
        position:relative;

    }
    .no-quiz{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        font-weight: bold;
        font-size:25px;
        color:#ccc;

    }

    .sheet-card{
        cursor:pointer;
        transition:.3s;
    }

    .sheet-card:hover{
        transform:translateY(-7px);
    }
    .sheet-card:active{
        transform:translateY(-4px);
    }

    .img-div{
        height:300px;
        display:flex;
        justify-content: center;
        padding:5px 0px;
        position:relative;
    }

    .img-div::before{
        content:'';
        position:absolute;
        display: block;
        background:rgba(0,0,0,.5);
        width:100%;
        top:0;
        bottom:0;

    }

    .floating{
        background: #2f48ff;
        color:white;
        padding:10px 30px;
        border-radius: 5px;
        border: none;
        @apply shadow-lg;
        position:fixed;
        bottom:25px;
        transition:.3s;
        right:35px;
    }
    .floating:focus{
        outline:none;
    }
    .floating:hover{
        background:#5367ff;
    }



</style>