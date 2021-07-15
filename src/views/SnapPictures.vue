<template>
    <div class="snap-page">
        <div v-show="mode=='snap'" class="mb-4 mx-auto">
            <h1 class="mb-4">Position the sheet vertically upwards and snap using the Snap button</h1>
            <div class="camera">
                <video ref="webcam" id="webcam-view" autoplay >Video stream not available.</video>
                <button @click="takeSnapshot" class="focus:outline-none mt-4 bg-blue-600 text-white px-10 py-4">Snap</button>
            </div>
            <canvas ref="canvas" id="canvas">
            </canvas>
            
            <div class="text-lg font-bold mt-4 text-left">Images:</div>
            <div ref="outputs" class="output flex ">

               <div v-for="im in snappedImagesData" :key="`snim${im.id}`" class="image-item relative">
                    <span @click="removeImage(im.id)" class="text-red-500 absolute right-4 top-0 cursor-pointer z-10">x</span>
                    <img  class="output-img w-64 mr-4" :src="im.data"   :alt="`snapped sheet ${im.id}`">
               </div>
            </div>
        </div>
        <div class="upload-div" v-show="mode=='upload'">
            <upload-images @change="onImageDrop" />
        </div>

        <div v-if="(mode=='snap'&& snappedImagesData.length) || (mode=='upload'&& uploadedImagesData.length)>0" class="correct-button flex justify-center items-center">
                <button @click="correctSheets" class="focus:outline-none mt-4 mr-4 bg-blue-600 text-white px-10 py-4">Correct</button>
                <button @click="saveSheets" class="focus:outline-none mt-4 bg-blue-600 text-white px-10 py-4">Save</button>
            
        </div>

        <button class="change-mode-but" @click="toggleMode">{{mode=='upload'?'snap':'upload'}}</button>
        
    </div>
</template>

<script>
    import UploadImages from 'vue-upload-drop-images'
    export default {
        name:"SnapPictures",
        data(){
            return {
                webcam:null,
                snappedImagesData:[],
                uploadedImagesData:[],
                currentIm:0,
                mode:'upload'
            }
        },
        computed:{
            /**
             * @returns {HTMLVideoElement} 
             */

            webcamEl(){
                return this.$refs.webcam;
            },
            /**
             * @returns {HTMLCanvasElement} 
             */
            canvas(){
                return this.$refs.canvas;
            },
            snapSound(){
                return this.$refs.snapSound;
            },

            
            
        },
        components:{
            UploadImages
        },

        methods:{
            initWebcam(){
                if(this.mode === 'snap')
                    {

                        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                        
                        navigator.mediaDevices.getUserMedia({video:true}).then(
                            stream=>{
                                const webcamEl = document.getElementById("webcam-view");
                                if(stream){                                
                                    webcamEl.srcObject = stream;
                                }
                                else{
                                    console.log("could not get stream");
                                }
                        }).catch(err=>{console.log("An error occured ", err);})

                        }
                        else{
                            console.log("No media avaiable");
                        }
                    }
            },
            stopWebcam(){},

            toggleMode(){
                if(this.mode==='upload'){
                    this.mode= 'snap';
                    this.initWebcam();
                }
                else{
                    this.mode = 'upload';
                    this.stopWebcam();
                }
            },
            takeSnapshot() {
                const canvas  = document.getElementById('canvas');
                const webcamEl  = document.getElementById('webcam-view');
                const width = 640;
                const height = 840;
                const context = canvas.getContext('2d');
                
            
                canvas.width = width;
                canvas.height = height;
                context.drawImage(webcamEl, 0, 0, width, height);
                
                var data = canvas.toDataURL('image/png');
                this.snappedImagesData.push({id:this.currentIm, data});
                this.currentIm++;
                console.log(Object.values(this.snappedImagesData));

                context.clearRect(0,0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;
                
            },
            removeImage(imId){
                const itemIndex = this.snappedImagesData.findIndex((item=>item.id===imId));
                if(itemIndex>=0)
                    this.snappedImagesData.splice(itemIndex,1);
                else console.log("index not found");
            },

            onImageDrop(files){
                if(!files.target){
                    this.uploadedImagesData = [];
                    for(let key in files){
                        this.uploadedImagesData.push(files[key]);
                    }
                }

            },

            async correctSheets(){
            
                    if((this.mode === 'upload' && this.uploadedImagesData.length===0)
                        || (this.mode === 'snap' && this.snappedImagesData.length===0)
                    ){
                        this.$swal({
                            title:'Upload Error',
                            text:"No image was uploaded. please upload and try again",
                            showCancelButton:true,
                            icon:'error'
                        });
                    }
                    else{
                        
                        const imagesForm = new FormData();
                        
                        imagesForm.set('sheet_id',this.$route.params.id);
                        
                        if(this.mode==='upload')
                            for (let img of Object.values(this.uploadedImagesData)){ 
                                imagesForm.append('images', img);
                            }
                        
                        else{
                            for(let img of Object.values(this.snappedImagesData)){
                                const res =  await fetch(img.data);
                                const  blob = await res.blob();
                                const imgFile = new File([blob], `snapsheet-${this.currentIm}.png`, { type: 'image/png' });
                                imagesForm.append('images',imgFile);
                            }
                            console.log(imagesForm.get('images'));
                        }
                        const loader = this.$loading.show();
                        try{
                            await this.$store.dispatch(
                                'uploadAnswerSheets',
                                imagesForm
                            );

                            this.$swal({
                            title:'Success',
                            text:'Sheets corrected Successfully',
                            toast:true,
                            timer:4000,
                            icon:'success'
                        });

                        }
                        catch(err){
                            this.$swal({
                            title:'Upload Error',
                            text:err.toString(),
                            showCancelButton:true,
                            icon:'error'
                        });
                        }

                        loader.hide();
                        
                    }
                
            },

            async saveSheets(){

            }
    
        },

        created(){
            if(this.$router.currentRoute.value.query.mode &&
             this.$router.currentRoute.value.query.mode==='snap' ){
                this.mode = 'snap';
            }
        },

        mounted(){

            this.$nextTick(()=>{
                
                    this.initWebcam();
                
                });  
        },

    }
</script>

<style lang="css" scoped>
    #webcam-view{
        width:90%;
        height:80vh;
        background-color:#666;
        margin:0 auto;
    }
    .output{
        display: flex;
        max-width: 95vw;
        @apply mx-auto;
        overflow: auto;
    }

    .output-img{
        width:100px;
        max-width: 100px;
        margin-right: 15px;
    }
    .upload-div{
        display: flex;
        align-items: center;
        justify-content: center;
        @apply pt-12;
    }
    .change-mode-but{
        background:#2f48ff;
        width:70px;
        height:70px;
        border-radius:50%;
        position:fixed;
        bottom:30px;
        right:15px;
        color:white;
        animation:changesize 2s ease-in-out infinite;
    }
    .change-mode-but:focus{
        outline:none;
    }

    @keyframes changesize {
        0%,100%{
            transform:scale(1);
            @apply shadow-lg;

        }
        50%{
            transform:scale(1.1);
            @apply shadow-md;
        }
    }
    
</style>
