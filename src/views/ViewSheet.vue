<template>
  <div class="view-sheet py-4 w-screen h-screen">
    <div v-show="!showStudents" class="sheet-options  flex items-stretch">
      <div class="tooltip mr-2">
        <span class="tooltiptext">
          Edit Sheet
        </span>
        <router-link
          :to="{
            path: '/create-sheet',
            query: { mode: 'edit', sheetid: $route.params.id },
          }"
          class="sheet-option block cursor-pointer p-1 bg-blue-600"
          ><img src="@/assets/images/edit.png" alt="edit"
        /></router-link>
      </div>

      <div class="tooltip mr-2">
        <span class="tooltiptext">
          Delete Sheet
        </span>
        <button
          @click="deleteSheet"
          class="sheet-option cursor-pointer p-1 bg-red-600"
        >
          <img src="@/assets/images/trash.png" alt="edit" />
        </button>
      </div>
      <div class="tooltip">
        <span class="tooltiptext">
          Students
        </span>
        <button
          @click="showStudents = true"
          class="sheet-option flex cursor-pointer p-1 bg-white"
        >
          <img class="w-8" src="@/assets/images/student.png" alt="students" />
        </button>
      </div>
    </div>
    <sheet-preview
      v-show="!showStudents"
      ref="sheet"
      :currentSheet="$store.getters.currentSheet"
      class="shadow-lg"
    />
    <students
      :students="students"
      v-if="showStudents"
      :sheet-id="$store.getters.currentSheet.id"
      :sheet-name="$store.getters.currentSheet.sheetName"
      @closeView="showStudents=false"
    />

    <button
      v-show="!showStudents"
      class="print-but floating"
      @click="printSheet"
    >
      Print Sheet
    </button>
    <router-link
      v-show="!showStudents"
      v-if="$store.getters.currentSheet.id"
      :to="`/snap-sheet/${$store.getters.currentSheet.id}`"
      class="getpics-but floating"
    >
      Upload Sheets
    </router-link>
  </div>
</template>

<script>
import SheetPreview from "../components/SheetPreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Students from "../components/dashboard/Students";

export default {
  name: "ViewSheet",
  components: {
    Students,
    SheetPreview,
  },
  data() {
    return {
      showStudents: false,
      students: [],
    };
  },
  computed: {
    /**
     * @returns {HTMLCanvasElement} canvas
     */
    canvas() {
      return this.$refs.canvas;
    },
    /**
     * @returns {HTMLElement}
     */
    sheet() {
      return this.$refs.sheet;
    },
  },

  methods: {
    async deleteSheet() {
      const result = await this.$swal({
        title: "Delete Sheet",
        text: "Do you really want to delete this sheet?",
        icon: "warning",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        try {
          await this.$store.dispatch("deleteQuiz", this.$route.params.id);
          this.$swal({
            toast: true,
            text: "Sheet deleted successfully",
            icon: "success",
            timer: 5000,
            showConfirmButton: false,
          });
          this.$router.replace("/dashboard");
        } catch (err) {
          this.$swal({
            title: "Error",
            text: `Could not delete sheet ${err}`,
            showCloseButton: true,
            icon: "error",
          });
        }
      }
    },
    printSheet() {
      const asheet = document.getElementById("answer-sheet");
      // const canvas = document.getElementById("image-canvas");
      asheet.classList.remove("sheet-border");
      window.scrollTo(0, 0);
      html2canvas(asheet)
        .then((canvas) => {
          const dataUrl = canvas.toDataURL();
          const image = new Image();
          image.src = dataUrl;
          const doc = new jsPDF({ unit: "px", format: [490, 820] });
          doc.addImage(image, "JPEG", 0, 0);
          doc.save("new-sheet.pdf");
          asheet.classList.add("sheet-border");
        })
        .catch((err) => {
          this.$swal({
            title: "Error",
            text: `Could not print sheet error:${err}`,
            icon: "error",
            showConfirmButton: true,
          });
        });
    },
  },

  created() {
    const loader = this.$loading.show();
    this.$store
      .dispatch("getQuiz", this.$route.params.id)
      .then((res) => {
        console.log(res);
        this.$store
          .dispatch("fetchStudents", this.$store.getters.currentSheet.id)
          .then((students) => {
            this.students = students;
          })
          .catch(
            // eslint-disable-next-line no-unused-vars
            (err) => {
              this.$swal({
                title: "Eror",
                text: `Could not load students for this sheet`,
                showCloseButton: true,
                icon: "error",
              });
            }
          )
          .finally(() => {
            loader.hide();
          });
      })
      .catch(() => {
        this.$swal({
          toast: true,
          text: "Unable not load sheet",
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
        });
      });
  },
};
</script>

<style lang="css" scoped>
.sheet-options {
  position: fixed;
  top: 100px;
  left: 50px;
  background: rgba(0, 0, 0, 0.3);
  @apply px-2;
  @apply pt-2;
  @apply shadow-lg;
}
.sheet-options button:focus {
  outline: none;
}
.floating {
  background: #2f48ff;
  color: white;
  padding: 10px 30px;
  border-radius: 5px;
  border: none;
  @apply shadow-lg;
  position: fixed;
  bottom: 25px;
  transition: 0.3s;
}

.print-but {
  right: 35px;
}
.getpics-but {
  left: 35px;
}

.floating:focus {
  outline: none;
}
.floating:hover {
  background: #5367ff;
}
</style>
