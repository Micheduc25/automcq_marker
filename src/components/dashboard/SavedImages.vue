<template>
  <div class="saved-sheets-view">
    <h1
      class="text-2xl font-bold text-left mb-6 underline w-full bg-gray-300 py-4 px-2 text-gray-600"
    >
      Saved Sheet Images
    </h1>
    <div class="head-tools border-b-2 border-gray-500 flex items-end mb-6">
      <div class="check-all flex items-center mr-4 mb-4 ">
        <label class="mr-2 cursor-pointer" for="checkall">check all</label>
        <input
          class="w-5 h-5 cursor-pointer"
          type="checkbox"
          v-model="checkall"
          name="checkall"
          id="checkall"
        />
      </div>
      <custom-select
        label="Filter by"
        v-model="filterBy"
        :id="'filtersheets'"
        :name="'filtersheets'"
        :options="['Date', 'Sheet Name', 'Images']"
      />
    </div>

    <ul class="sheets-list">
      <div class="list-titles">
        <span>Selected</span><span>Name</span><span>Pending Images</span
        ><span>Actions</span>
      </div>
      <li
        v-for="sheet in getSortedPendingSheets"
        :key="`sheet${sheet.id}`"
        class="sheets-list-item border border-gray-300 rounded-md shadow-lg mb-3 p-3"
      >
        <input
          class="w-5 h-5 cursor-pointer mr-4"
          type="checkbox"
          v-model="checkBoxes[sheet.id]"
          name="check"
          id="check"
        />
        <div class="sheet font-semibold">{{ sheet.sheet_name }}</div>
        <div class="num-images">{{ sheet.pending_images }}</div>
        <div class="actions flex items-center">
          <button class="bg-blue-700 hover:bg-blue-500 p-2 shadow-lg mr-2">
            <img class="w-5" src="@/assets/images/edit.png" alt="edit images" />
          </button>
          <button class="bg-red-700 hover:bg-red-500 p-2 shadow-lg mr-2">
            <img
              class="w-5"
              src="@/assets/images/trash.png"
              alt="delete images"
            />
          </button>
          <button @click="batchCorrect(sheet.id)" class="bg-green-700 hover:bg-green-500 p-2 shadow-lg">
            <img
              class="w-5"
              src="@/assets/images/test.png"
              alt="correct images"
            />
          </button>
        </div>
      </li>
    </ul>

    <div class="batch-correct flex justify-end">
      <button
        v-if="showBatchCorrectBut"
        class="focus:outline-none mt-4 mr-4 bg-blue-600 text-white px-10 py-4"
        @click="batchCorrect()"
      >
        Batch Correct ({{ numberChecked }})
      </button>
    </div>
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect.vue";
export default {
  components: { CustomSelect },
  name: "SavedImages",
  data() {
    return {
      checkall: false,
      filterBy: "Date",
      checkBoxes: {},
    };
  },

  computed: {
    pendingSheets() {
      return this.$store.getters.quizes.filter((q) => q.pending_images > 0);
    },
    showBatchCorrectBut() {
      return (
        Object.values(this.checkBoxes).filter((val) => val === true).length > 0
      );
    },
    numberChecked() {
      return Object.values(this.checkBoxes).filter((val) => val === true)
        .length;
    },

    selectedSheetIds(){
        return Object.keys(this.checkBoxes).filter((key) => this.checkBoxes[key] === true);
    },

      getSortedPendingSheets() {
          const pSheets = this.$store.getters.quizes.filter((q) => q.pending_images > 0);
      if (this.filterBy === "Date") {
        return pSheets.sort((prevSheet, nextSheet) => {
          const prevDate = new Date(prevSheet.created);
          const nextDate = new Date(nextSheet.created);
          if (prevDate < nextDate) return -1;
          else if (prevDate === nextDate) return 0;
          else return 1;

          //    [].sort()
        });
      } else if (this.filterBy === "Sheet Name") {
        return pSheets.sort((prevSheet, nextSheet) => {
          return prevSheet.sheet_name.localeCompare(nextSheet.sheet_name);
        });
      } else if (this.filterBy === "Images") {
        return pSheets.sort((prevSheet, nextSheet) => {
          if (prevSheet.pending_images < nextSheet.pending_images) return -1;
          else if (prevSheet.pending_images === nextSheet.pending_images)
            return 0;
          else return 1;
        });
      }

      return pSheets;
    },
  },

  methods: {
      async batchCorrect(sheet_id){
          let result;
          const loader = this.$loading.show();
          try{
            
            if(sheet_id!==null){
                
                result = await this.$store.dispatch('batchCorrectSheets',[parseInt(sheet_id)]);
            }
            else{ 

                result = await this.$store.dispatch('batchCorrectSheets', this.selectedSheetIds.map(id=>parseInt(id)))

                }

            console.log("sheets corrected ===>",result);
          }
          catch(err){
              this.$swal({
              title: "Eror",
              text: `${err}`,
              showCloseButton: true,
              icon: "error",
            });
          }
          finally{
              loader.hide();
          }
      },

      
  },
  watch: {
    checkall(newVal, oldVal) {
      if (newVal !== oldVal) {
        for (let quiz of this.pendingSheets) {
          this.checkBoxes[quiz.id] = newVal;
        }
      }
    },
  },

  created() {
    if (this.$store.getters.quizes.length < 0) {
      const loader = this.$loading.show();
      this.$store
        .dispatch("getQuizList")
        .then((quizes) => {
          console.log(quizes);
        })
        .catch(
          // eslint-disable-next-line no-unused-vars
          (err) => {
            this.$swal({
              title: "Eror",
              text: `Could not load quizes`,
              showCloseButton: true,
              icon: "error",
            });
          }
        )
        .finally(() => {
          loader.hide();
        });
    }
  },
};
</script>

<style lang="css" scoped>
.sheets-list-item,
.list-titles {
  display: grid;
  grid-template-columns: 1fr 8fr 3fr 5fr;
  justify-items: flex-start;
  align-items: center;
  column-gap: 20px;
  text-align: left;
}
.list-titles {
  font-weight: bold;
  @apply mb-2;
}
</style>
