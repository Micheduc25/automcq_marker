<template>
    <div class="saved-sheets-view">
        <h1 class="text-2xl font-bold text-left mb-6 underline w-full bg-gray-300 py-4 px-2 text-gray-600" >Saved Sheet Images</h1>
        <div class="head-tools border-b-2 border-gray-500 flex items-end mb-6">
            <div class="check-all flex items-center mr-4 mb-4 ">
                <label class="mr-2 cursor-pointer" for="checkall">check all</label>
                <input class="w-5 h-5 cursor-pointer"  type="checkbox" v-model="checkall" name="checkall" id="checkall">
                
            </div>
            <custom-select label="Filter by" v-model="filterBy"  :id="'filtersheets'" :name="'filtersheets'" :options="['Date', 'Sheet Name']"/>
        </div>

        <ul class="sheets-list">
            <div class="list-titles"><span>Selected</span><span>Name</span><span>Images</span><span>Actions</span></div>
            <li class="sheets-list-item border border-gray-300 rounded-md shadow-lg mb-3 p-3">
                <input class="w-5 h-5 cursor-pointer mr-4"  type="checkbox" v-model="checkall" name="check" id="check">
                <div class="sheet font-semibold">Sheet Name Here</div>
                <div class="num-images">142</div>
                <div class="actions flex items-center">
                    <button class="bg-blue-700 hover:bg-blue-500 p-2 shadow-lg mr-2"><img class="w-5" src="@/assets/images/edit.png" alt="edit images"></button>
                    <button  class="bg-red-700 hover:bg-red-500 p-2 shadow-lg mr-2"><img class="w-5" src="@/assets/images/trash.png" alt="delete images"></button>
                    <button  class="bg-green-700 hover:bg-green-500 p-2 shadow-lg"><img class="w-5" src="@/assets/images/test.png" alt="correct images"></button>
                </div>
                
            </li>
        </ul>
    </div>
</template>

<script>
import CustomSelect from '../CustomSelect.vue'
    export default {
  components: { CustomSelect },
        name:"SavedImages",
        data(){
            return {
                checkall:false,
                filterBy:'Date'
            }
        }
    }
</script>

<style lang="css" scoped>
    .sheets-list-item,.list-titles{
        display: grid;
        grid-template-columns: 1fr 8fr 3fr 5fr;
        justify-items: flex-start;
        align-items: center;
        column-gap: 20px;
        text-align: left;
    }
    .list-titles{
        font-weight: bold;
        @apply mb-2;
    }
</style>