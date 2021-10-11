<template>
  <div class="student-results pt-5 px-5">
    <div
      v-if="student_results.length > 0"
      class="student-info flex justify-center text-2xl font-bold bg-gray-300 py-3 px-2 mb-4"
    >
      <div class="mr-6">Name: {{ student_results[0].student.name }}</div>
      <div>Code: {{ student_results[0].student.code }}</div>
    </div>

    <div class="general-result flex justify-center mb-8">
      <div class="text-2xl">
        <div class=" font-bold mb-2">Mark</div>
        <div
          :class="{
            'border-green-600': mark / total >= 0.5,
            'border-yellow-600': mark / total > 0.3,
            'border-red-600': mark / total > 0,
          }"
          class="mark-container"
        >
          <span
            :class="{
              'text-green-600': mark / total >= 0.5,
              'text-yellow-600': mark / total > 0.3,
              'text-red-600': mark / total > 0,
            }"
          >
            {{ mark }}/{{ total }}</span
          >
        </div>
      </div>
    </div>

    <div class="detailed-results">
      <div class="text-2xl font-bold bg-gray-300 py-3 px-2 mb-4">Detailed Results</div>
      <div class="results-list">
          <table class="details-table w-full border-collapse mb-6">
          <tr class="text-center">
            <th class="pl-3">Question No</th>
            <th>Answered Correct</th>
            <th>Answered Wrong</th>
            <th>Mark obtained</th>
          </tr>

          <template v-for="result in student_results" :key="`res${result.id}`">
            <tr
              class="result-item hover:bg-blue-200 transition-all cursor-pointer shadow-lg rounded-md p-4 w-full text-center border border-gray-300 h-12"
               
            >
              <td class="w-1/4 pl-3">{{ result.id }}</td>
              <td class="w-1/4">{{result.answered_correct.length>0? result.answered_correct.join(','):'-' }}</td>
              <td class="w-1/4">{{result.answered_wrong.length>0? result.answered_wrong.join(','):'-'}}</td>
              <td class="w-1/4">{{ result.mark }}</td>
            </tr>
          </template>
        </table>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultsDetails",
  data() {
    return {
      student_code: "",
      student_results: [],
      mark: 0,
      total: 0,
    };
  },

  async created() {
    this.student_code = this.$route.params.code;
    const loader = this.$loading.show();
    this.mark = this.$store.getters.currentStudentResult.mark;
    this.total = this.$store.getters.currentStudentResult.total;
    

    try {
      this.student_results = await this.$store.dispatch("fetchStudentResults", {
        student_code: this.student_code,
        session: 1,
      });

      this.student_results = this.student_results.sort((prev,next)=>{
        if(prev.id>next.id)return 1;
        else if(prev.id<next.id) return -1;
        else return 0; 
      });

      console.log(this.student_results);
    } catch (err) {
      console.log(err);
      this.$swal({
        title: "Error",
        text: "Could not load results",
        icon: "error",
        showConfirmButton: true,
      });
    }
    loader.hide();
  },
};
</script>

<style lang="css" scoped>
.mark-container {
  width: 150px;
  height: 150px;
  flex: 0 0 150px;
  border-radius: 50%;
  border-width: 10px;
  border-style: solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
