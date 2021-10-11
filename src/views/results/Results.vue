<template>
  <div class="all-results">
    <div class="page-content px-6">
      <h1 v-if="results" class="text-3xl font-bold bg-gray-400 p-3 mb-8">
        Results for {{ results[0].sheet }}
      </h1>
      <main class="result-list">
        <table v-if="results" class="result-table w-full border-collapse mb-6">
          <tr class="text-left">
            <th class="pl-3">Code</th>
            <th>Name</th>
            <th>Mark</th>
            <th>Total</th>
          </tr>

          <template v-for="result in results" :key="`res${result.id}`">
            <tr
              class="result-item hover:bg-blue-200 transition-all cursor-pointer shadow-lg rounded-md p-4 w-full text-left border border-gray-300 h-12"
               @click="viewStudentResult(result)"
            >
              <td class=" w-1/6 pl-3">{{ result.student.code }}</td>
              <td class="w-3/6">{{ result.student.name }}</td>
              <td class="w-1/6">{{ result.mark }}</td>
              <td class="w-1/6">{{ result.total }}</td>
            </tr>
          </template>
        </table>

        <div class="text-3xl font-bold text-gray-400 text-center" v-else>
          No results available
        </div>

        <div class="chart-container w-full mx-4" >
            <bar-chart v-if="results" :data="chartData" :options="chartOptions" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import BarChart from "../../components/BarChart.vue";
// import _ from 'lodash';
export default {
  components: { BarChart },
  name: "Results",

  data() {
    return {
      results: null,
      chartData: null,
      chartOptions: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  methods:{
    viewStudentResult(result){
      this.$store.dispatch("setCurrentStudentResult",result)
      this.$router.push(`/results/${result.student.code}`)
    }
  },

  created() {
    const loader = this.$loading.show();
    const sheet_id = this.$route.query.sheet_id;

    this.$store
      .dispatch("fetchSheetResults", { sheet_id })
      .then((res) => {
        if (res.length > 0) {
          this.results = res;
          this.results = this.results.sort((prev, next) => {
            if (prev.session > next.session) return -1;
            else if (prev.session < next.session) return 1;
            else return 0;
          });

          this.chartData = {
            labels: this.results.map((r) => r.student.code),
            datasets: [
              {
                label: `Barchart for ${this.results[0].sheet} results`,
                data: this.results.map((r) => r.mark),
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  const value = context.dataset.data[index];
                  const max = this.results[0].total;
                  return value / max < 0.3
                    ? "red"
                    : value / max < 0.5
                    ? "orange"
                    : "green";
                },

                borderWidth: 1,
              },
            ],
          };
          console.log(res);
        }
      })
      .catch((err) => {
        console.error(err);
        this.$swal({
          title: "Error",
          text: "Could not load results",
          icon: "error",
          showConfirmButton: true,
        });
      })
      .finally(() => loader.hide());
  },
};
</script>

<style lang="scss" scoped></style>
