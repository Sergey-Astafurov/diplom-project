<template>
  <v-dialog width="1200">
    <template v-slot:activator="{ props }">
      <v-btn class="btn-action" v-bind="props" :prepend-icon="icon" text="добавить">
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="Добавить запись">
        <v-card-text primary>
          Чтобы добавить запись введите заголовок и текст записи
        </v-card-text>
        <v-form class="px-5" @submit.prevent="addRecord">
          <v-text-field
            autofocus
            variant="outlined"
            v-model="record.title"
            label="Заголовок"
          ></v-text-field>
          <v-textarea
            variant="outlined"
            v-model="record.text"
            type="text"
            :counter="400"
            label="Текст"
          ></v-textarea>

          <v-btn
            @click="isActive.value = false"
            type="submit"
            :disabled="record.title.length < 2"
            text="Добавить"
          ></v-btn>
        </v-form>
        <v-card-actions>
          <tags-tool
            :selected="record.selected"
            :tags="tags"
            :selectionsTags="selections"
          />
          <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-snackbar color="success" elevation="24" v-model="snackbarAddRec" timeout="2000">
    Запись добавлена
  </v-snackbar>
</template>
<script>
import { getDatabase, ref, child, push, update } from "firebase/database";
import TagsTool from "./TagsTool.vue";
export default {
  inject: ["uid"],
  props: ["date", "tags"],
  components: { TagsTool },

  data() {
    return {
      snackbarAddRec: false,
      record: {
        title: "",
        text: "",
        selected: [],
      },
      icon: "mdi-plus",
    };
  },
  methods: {
    addRecord() {
      this.writeUserData(this.record);
      this.snackbarAddRec = true;
      this.record.title = "";
      this.record.text = "";
      this.record.selected = [];
    },

    async writeUserData({ selected, title, text }) {
      const userId = await this.uid();
      const db = await getDatabase();

      const recordData = {
        title: title,
        textRecord: text,
        dateRecord: this.date,
        tagsRecord: selected.length > 0 ? selected.map((el) => el.tag) : ["без тегов"],
      };
      const newRecordKey = push(child(ref(db), "records")).key;
      const updates = {};
      updates[`/records/${userId}/` + newRecordKey] = recordData;

      return update(ref(db), updates);
    },
  },
  computed: {
    selections() {
      const selections = [];
      for (const selection of this.record.selected) {
        selections.push(selection.tag);
      }
      return selections;
    },
  },
};
</script>
<script setup></script>

<style scoped>
.btn-action {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
</style>
