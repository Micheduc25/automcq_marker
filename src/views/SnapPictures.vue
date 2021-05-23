<template>
    <div class="snap-page">
        <div class=" mb-4 mx-auto">
            <h1 class="mb-4">Position the sheet vertically upwards and snap using the Snap button</h1>
            <div class="camera">
                <video ref="webcam" id="webcam-view" autoplay >Video stream not available.</video>
                <button @click="takeSnapshot" class="focus:outline-none mt-4 bg-blue-600 text-white px-10 py-4">Snap</button>
            </div>
            <canvas ref="canvas" id="canvas">
            </canvas>
            <div class="output">
                <img ref="photo" id="photo" alt="The screen capture will appear in this box."> 
            </div>

        </div>
    </div>
</template>

<script>

    export default {
        name:"SnapPictures",
        data(){
            return {
                webcam:null
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

            /**
             * @returns {HTMLImageElement} 
             */
            photo(){
                return this.$refs.photo
            }
        },

        methods:{
        takeSnapshot() {
            const width = 640;
            const height = 840;
            var context = this.canvas.getContext('2d');
          
            this.canvas.width = width;
            this.canvas.height = height;
            context.drawImage(this.webcamEl, 0, 0, width, height);
            
            var data = this.canvas.toDataURL('image/png');
            this.photo.setAttribute('src', data);
            context.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.canvas.width = 0;
            this.canvas.height = 0;
            
  }
        },

        mounted(){
            this.$nextTick(()=>{
                
                if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                
                navigator.mediaDevices.getUserMedia({video:true}).then(
                    stream=>{
                        if(stream){
                            
                            this.webcamEl.srcObject = stream;
                        }
                        else{
                            console.log("could not get stream");
                        }
                }).catch(err=>{console.log("An error occured ", err);})

                }
                else{
                    console.log("No media avaiable");
                }
                
                });
            

            
                
            
        }

    }
</script>

<style lang="css" scoped>
    #webcam-view{
        width:90%;
        height:80vh;
        background-color:#666;
        margin:0 auto;
    }
    .output img{
        width:840px;
        height: 640px;
        margin:0 auto;
    }
</style>