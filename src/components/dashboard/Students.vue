<template>
  <div class="students-view px-6">
    <div
      class="w-full bg-gray-300 py-4 px-2 mb-6 flex justify-between items-center"
    >
      <h1 class="text-2xl font-bold text-left  underline  text-gray-600">
        Students for {{ sheetName }}
      </h1>

      <button
        class=" bg-red-700 text-white text-xl font-bold py-1 px-3 rounded shadow-lg transition-all hover:bg-red-500"
        @click="$emit('closeView')"
      >
        x
      </button>
    </div>
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
        :options="['Date', 'Name', 'Code']"
      />
    </div>

    <ul class="students-list">
      <div class="list-titles">
        <span>Selected</span><span>Name</span><span>Code</span
        ><span>E-mail</span><span>Actions</span>
      </div>
      <li
        v-for="student in getSortedStudents"
        :key="`sheet${student.code}`"
        class="students-list-item border border-gray-300 rounded-md shadow-lg mb-3 p-3"
      >
        <input
          class="w-5 h-5 cursor-pointer mr-4"
          type="checkbox"
          v-model="checkBoxes[student.code]"
          name="check"
          id="check"
        />
        <div class="student font-semibold">{{ student.name }}</div>
        <div class="code">{{ student.code }}</div>
        <div class="">{{ student.email }}</div>
        <div class="actions flex items-center">
          <button
            @click="selectEdit(student)"
            class="bg-blue-700 hover:bg-blue-500 p-2 shadow-lg mr-2"
          >
            <img class="w-5" src="@/assets/images/edit.png" alt="edit images" />
          </button>
          <button
            @click="deleteStudent(student.code)"
            class="bg-red-700 hover:bg-red-500 p-2 shadow-lg mr-2"
          >
            <img
              class="w-5"
              src="@/assets/images/trash.png"
              alt="delete images"
            />
          </button>
        </div>
      </li>
    </ul>

    <transition name="fade">
      <div
        style="background-color:rgba(0,0,0,.5)"
        class="fixed w-screen h-screen flex items-center justify-center top-0 left-0"
        v-show="showForm"
        @click="showForm = false"
      >
        <form
          autocomplete="on"
          class="student-form rounded-lg bg-white shadow-lg px-10 py-3"
          @click.stop="() => {}"
        >
          <h2 class="mb-4 font-bold">
            {{ isEditMode ? "Modify Student Info" : "Add a Student" }}
          </h2>
          <custom-input
            id="student-code"
            v-model="formData.code"
            placeholder="Enter student code"
            name="student-code"
            label="Student Code"
            :required="true"
            :errorMsg="formErrors.code"
          />
          <custom-input
            id="student-name"
            v-model="formData.name"
            :required="true"
            placeholder="Enter student name"
            name="student-name"
            label="Student Name"
            :errorMsg="formErrors.name"
          />
          <custom-input
            id="student-email"
            v-model="formData.email"
            placeholder="Enter student email"
            type="email"
            name="student-email"
            label="Student Email"
            :errorMsg="formErrors.email"
          />

          <button
            @click.prevent="!isEditMode ? addStudent() : editStudent()"
            type="submit"
            class="transition-all hover:bg-blue-500 bg-blue-600 px-4 py-2 text-white"
          >
            {{ isEditMode ? "Modify" : "Add" }}
          </button>
        </form>
      </div>
    </transition>

    <button
      class="transition-all hover:bg-blue-500 bg-blue-600 focus:outline-none rounded-full w-14 h-14 fixed bottom-12 right-10 text-white text-5xl shadow-lg"
      @click="showForm = true"
    >
      +
    </button>
  </div>
</template>

<script>
import CustomInput from "../CustomInput.vue";
import CustomSelect from "../CustomSelect.vue";
export default {
  components: { CustomSelect, CustomInput },
  name: "Students",
  props: {
    sheetName: String,
    sheetId: [String, Number],
    students: [Object],
  },
  data() {
    return {
      checkall: false,
      filterBy: "Date",
      showForm: false,
      isEditMode: false,
      editCode: null,
      formData: {
        name: "",
        code: "",
        email: "",
      },
      formErrors: {
        name: "",
        code: "",
        email: "",
      },
      allStudents: [],
      checkBoxes: {},
    };
  },

  computed: {
    numberChecked() {
      return Object.values(this.checkBoxes).filter((val) => val === true)
        .length;
    },

    selectedStudentsIds() {
      return Object.keys(this.checkBoxes).filter(
        (key) => this.checkBoxes[key] === true
      );
    },

    getSortedStudents() {
      let filtered = this.allStudents;
      // const pSheets = this.$store.getters.quizes.filter((q) => q.pending_images > 0);
      if (this.filterBy === "Date") {
        filtered = this.allStudents.filter((s1, s2) => {
          const prevDate = new Date(s1.date_joined);
          const nextDate = new Date(s2.date_joined);
          if (prevDate < nextDate) return -1;
          else if (prevDate === nextDate) return 0;
          else return 1;
        });
      } else if (this.filterBy === "Name") {
        filtered = this.allStudents.filter((s1, s2) => {
          return s1.name.localeCompare(s2.name);
        });
      } else if (this.filterBy === "Code") {
        filtered = this.allStudents.filter((s1, s2) => {
          return s1.code.localeCompare(s2.code);
        });
      }
      return filtered;
    },
  },

  methods: {
    async addStudent() {
      if (!/.+@.+\..+/.test(this.formData.email)) {
        this.formErrors.email =
          "invalid email format. required format is example@example.xyz";
      } else if (this.formData.code.length < 2)
        this.formErrors.code = "code should be atleast two characters";
      else if (this.formData.name.length < 1)
        this.formErrors.name = "The name field should not be empty";
      else {
        const loading = this.$loading.show();
        this.formErrors.name = "";
        this.formErrors.code = "";
        this.formErrors.email = "";
        try {
          const new_stud = await this.$store.dispatch("addStudent", {
            sheet_id: this.sheetId,
            student_data: this.formData,
          });
          this.allStudents.push(new_stud);

          this.showForm = false;
          this.formData.name = "";
          this.formData.code = "";
          this.formData.email = "";

          this.$swal({
            toast: true,
            timer: 4000,
            text: `Successfully added student`,
            icon: "success",
            showConfirmButton: false,
          });
        } catch (err) {
          this.$swal({
            title: "Error",
            text: `An error occured while trying to add the student`,
            showCloseButton: true,
            icon: "error",
          });
        } finally {
          loading.hide();
        }
      }
    },

    selectEdit(student) {
      this.editCode = student.code;
      this.isEditMode = true;
      this.formData.code = student.code;
      this.formData.email = student.email;
      this.formData.name = student.name;
      this.showForm = true;
    },
    async editStudent() {
      if (!/.+@.+\..+/.test(this.formData.email)) {
        this.formErrors.email =
          "invalid email format. required format is example@example.xyz";
      } else if (this.formData.code.length < 2)
        this.formErrors.code = "code should be atleast two characters";
      else if (this.formData.name.length < 1)
        this.formErrors.name = "The name field should not be empty";
      else {
        const loading = this.$loading.show();
        this.formErrors.name = "";
        this.formErrors.code = "";
        this.formErrors.email = "";
        try {
          const modified_stud = await this.$store.dispatch("editStudent", {
            code: this.editCode,
            sheet_id: this.sheetId,
            student_data: this.formData,
          });
          const s_index = this.allStudents.findIndex(
            (stud) => stud.code === this.editCode
          );
          if (s_index > -1) {
            this.allStudents[s_index] = modified_stud;
            this.showForm = false;
            this.formData.name = "";
            this.formData.code = "";
            this.formData.email = "";

            this.$swal({
              toast: true,
              timer: 4000,
              text: `Successfully edited student`,
              icon: "success",
              showConfirmButton: false,
            });
          } else console.error("could not find student at index", s_index);
        } catch (err) {
          this.$swal({
            title: "Error",
            text: `An error occured while trying to add the student`,
            showCloseButton: true,
            icon: "error",
          });
        } finally {
          this.isEditMode = false;
          loading.hide();
        }
      }
    },

    async deleteStudent(code) {
      const ans = await this.$swal({
        title: "Remove Student",
        text: `Are you sure you want to remove the student with code ${code}`,
        showConfirmButton: true,
        showCancelButton: true,
        icon: "warning",
      });

      if (ans.isConfirmed) {
        const loading = this.$loading.show();
        try {
          const res = await this.$store.dispatch("deleteStudent", {
            code,
            sheet_id: this.sheetId,
          });
          console.log(res);

          const s_index = this.allStudents.findIndex(
            (stud) => stud.code === code
          );
          if (s_index > -1) {
            this.allStudents.splice(s_index, 1);
            this.$swal({
              toast: true,
              timer: 4000,
              text: `Successfully removed student`,
              icon: "success",
              showConfirmButton: false,
            });
          }
        } catch (err) {
          this.$swal({
            title: "Error",
            text: `We were unable to delete this student`,
            showConfirmButton: true,
            icon: "error",
          });
        }
        finally{
          loading.hide();
        }
      }
    },
  },
  watch: {
    checkall(newVal, oldVal) {
      if (newVal !== oldVal) {
        for (let stud of this.allStudents) {
          this.checkBoxes[stud.code] = newVal;
        }
      }
    },
  },

  created() {
    this.allStudents = this.students;
    console.log("all students set", this.allStudents, this.students);
  },
};
</script>

<style lang="css" scoped>
.students-list-item,
.list-titles {
  display: grid;
  grid-template-columns: 1fr 7fr 3fr 4fr 5fr;
  justify-items: flex-start;
  align-items: center;
  column-gap: 20px;
  text-align: left;
}
.list-titles {
  font-weight: bold;
  @apply mb-2;
}
.student-form {
  backdrop-filter: blur(5px);
}
</style>
