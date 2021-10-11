<template>
    <div class="chart-container relative" style="height:40vh; width:80vw;">
        <canvas id="resultsBar" ></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
export default {
  name: "BarChart",
  props: ["data", "options"],

  created(){
      Chart.register(...registerables);
  },

  mounted() {
      const ctx = document.getElementById('resultsBar').getContext('2d');
      const barChart = new Chart(
          ctx, 
          {
              type:'bar',
              data:this.data,
              options:this.options
          }
      );
      barChart.resize( window.innerWidth,500);
      
    //   console.log(barChart);
  },
};
</script>