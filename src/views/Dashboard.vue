<template>
    <div class="dashboard-page">
        <aside class="side-bar px-4">
            <h3 class="font-bold text-left  mt-4 mb-6 text-xl">Dashboard</h3>

            <ul class="actions-list">
                <li @click="selectView('sheets')" :class="{'active':view==='sheets'}"  class="dashboard-action" > <img src="@/assets/images/exam1.png" alt="exam" /> My Sheets</li>
                <li @click="selectView('saved')" :class="{'active':view==='saved'}" class="dashboard-action"> <img src="@/assets/images/student1.png" alt="student"/> Saved Sheets</li>
                <li @click="selectView('more')" :class="{'active':view==='more'}" class="dashboard-action">+ More...</li>
            </ul>
        </aside>

        <main class="dashboard-body p-4">
            <sheets-view v-if="view==='sheets'" />
            <saved-images v-else-if="view==='saved'" />
        </main>
    </div>
</template>

<script>
import SavedImages from '../components/dashboard/SavedImages.vue';
import SheetsView from '../components/dashboard/SheetsView.vue';
    
    export default {
  components: { SheetsView, SavedImages },
        name:"Dashboard",

        data(){
            return {
                view:'sheets',
                quizes:null,
                isLoading:true
            }
        },

        methods:{
            selectView(view){
                this.view = view;
            },
        },

        created(){
           
        }



    }
</script>

<style lang="css" scoped>
    .dashboard-page{
        display: flex;
    }

    .side-bar{
        flex:1 1 20%;
        position:sticky;
        top:60px;
        margin-top: 5px;
        background:#2f48ff;
        color:white;
        height:88vh;
    }

    .dashboard-body{
        flex: 1 1 80%;
    }

    /* .actions-list{

    } */
    .dashboard-action{
        text-align:left;
        padding: 8px 5px;
        cursor:pointer;
        transition:.3s;
        border-bottom: 1px solid white;
        display: flex;
        align-items: center;
        position:relative;
        overflow:hidden;

    }

    .dashboard-action::before{
        content:'';
        position:absolute;
        display: block;
        width:100%;
        left:0;
        right:0;
        bottom:-5px;;
        height:5px;
        background-color:white;
        transition:.3s;
        
    }
    .dashboard-action.active::before{
        bottom: 0 !important;
    }

    .dashboard-action img{
        @apply mr-2;
        width:40px;
    }
    .dashboard-action:hover::before{
       bottom:0;

    }
    .dashboard-action:not(:last-child){
        @apply mb-2;
    }
</style>