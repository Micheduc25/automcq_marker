<template>
    <div class="view-sheet py-4 w-screen h-screen">
        <div class="sheet-options  flex items-center">
            <div class="tooltip mr-2">
               <span class="tooltiptext">
                    Edit Sheet
               </span>
                <router-link :to="{path:'/create-sheet', query:{mode:'edit', sheetid:$route.params.id}}"  class="sheet-option block cursor-pointer p-1 bg-blue-600"><img src="@/assets/images/edit.png" alt="edit"></router-link>
            </div>

            <div class="tooltip">
                <span class="tooltiptext">
                    Delete Sheet
               </span>
                <button @click="deleteSheet"  class="sheet-option cursor-pointer p-1 bg-red-600"><img src="@/assets/images/trash.png" alt="edit"></button>

            </div>
            
        </div>
        <sheet-preview ref="sheet" :currentSheet="$store.getters.currentSheet" class="shadow-lg"/>

        <button class="print-but floating" @click="printSheet">
            Print Sheet
        </button>
        <router-link v-if="$store.getters.currentSheet.id" :to="`/snap-sheet/${$store.getters.currentSheet.id}`" class="getpics-but floating">
            Upload Sheets
        </router-link>
    </div>
</template>

<script>
    import SheetPreview from '../components/SheetPreview';
    import jsPDF from 'jspdf'
    import html2canvas from 'html2canvas';
    
    export default {
        name:"ViewSheet",
        components:{
            SheetPreview
        },
        computed:{

            /**
             * @returns {HTMLCanvasElement} canvas
             */
            canvas(){
                return this.$refs.canvas;
            }
            ,
            /**
             * @returns {HTMLElement}
             */
            sheet(){
                return this.$refs.sheet;
            }
        },

        methods:{

            async deleteSheet(){
                const result = await this.$swal({
                    title:'Delete Sheet',
                    text:'Do you really want to delete this sheet?',
                    icon:'warning',
                    showConfirmButton:true,
                    showCancelButton:true
                });
                
                if(result.isConfirmed){
                    try{
                        await this.$store.dispatch('deleteQuiz',this.$route.params.id);
                        this.$swal({
                            toast:true,
                            text:"Sheet deleted successfully",
                            icon:'success',
                            timer:5000,
                            showConfirmButton:false
                        })
                        this.$router.replace('/dashboard');
                    }
                    catch(err){
                        this.$swal({
                                title:'Error',
                                text:`Could not delete sheet ${err}`,
                                showCloseButton: true,
                                icon:'error'
                            })
                    }
                }

            },
            printSheet(){
                const asheet = document.getElementById("answer-sheet");
                // const canvas = document.getElementById("image-canvas");
                asheet.classList.remove('sheet-border');
                window.scrollTo(0,0);
                html2canvas(asheet).then((
                    canvas=>{
                        const dataUrl = canvas.toDataURL();
                        const image = new Image();
                        image.src = dataUrl;
                        const doc = new jsPDF({unit:'px', format:[490, 820]});
                        doc.addImage(image,'JPEG',0,0);
                        doc.save('new-sheet.pdf');
                        asheet.classList.add('sheet-border');

                }
                )).catch(err=>{
                    this.$swal({
                        title:'Error',
                        text:`Could not print sheet error:${err}`,
                        icon:'error',
                        showConfirmButton:true
                    })
                });

            },
           
        },

        created(){
            if(Object.keys(this.$store.getters.currentSheet).length===0){
                const loader = this.$loading.show();
                this.$store.dispatch('getQuiz',this.$route.params.id)
                .then(res=>{
                    console.log(res);
                })
                .catch(()=>{
                    this.$swal({
                        toast:true,
                        text:"Unable not load sheet",
                        icon:'error',
                        timer:5000,
                        showConfirmButton:false
                    })
                })
                .finally(()=>{loader.hide();});
            }
        }
    }
</script>

<style lang="css" scoped>

    .sheet-options{
        position:fixed;
        top:100px;
        left:50px;
        background:rgba(0,0,0,.3);
        @apply px-2;
        @apply pt-2;
        @apply shadow-lg;

        
    }  
    .sheet-options button:focus{
            outline:none;
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
        
    }

    .print-but{
        right:35px;
    }
    .getpics-but{
        left:35px;
    }

    .floating:focus{
        outline:none;
    }
    .floating:hover{
        background:#5367ff;
    }
</style>