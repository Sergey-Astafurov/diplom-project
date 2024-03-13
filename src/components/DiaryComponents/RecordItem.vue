<template>
  <v-dialog width="1300" height="1500" class="ma-5">
    <template v-slot:activator="{ props }">
      <v-card v-bind="props" class="my-5" variant="outlined" hover max-height="200">
        <v-card-item loading="lazy" class="d-flex pa-3">
          <div class="d-flex">
            <div class="d-flex flex-column pr-3 align-center justify-space-between">
              <v-card-text class="pa-0 text-h6">
                {{ dateForRecord.weekday }}
              </v-card-text>
              <v-card-text class="pa-1 my-5 mx-3 text-h4">
                {{ dateForRecord.day }}
              </v-card-text>
              <v-card-text class="pa-0 text-h6">
                {{ dateForRecord.time }}
              </v-card-text>
            </div>
            <v-divider :thickness="5" class="border-opacity-100" vertical></v-divider>
            <div class="pl-3 pa-3 d-flex flex-column">
              <v-card-text class="pa-0 mb-3 text-h5">
                {{ title }}
              </v-card-text>
              <v-card-subtitle>
                {{ text }}
              </v-card-subtitle>
              <div class="chip pt-5 w-100">
                <v-chip
                  class="justify-center ma-1 flex-row"
                  v-for="(tag, i) in tags"
                  :key="i"
                  >{{ tag }}</v-chip
                >
              </div>
            </div>
          </div>
        </v-card-item>
      </v-card>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="pa-5">
        <v-card-title primary-title> Заголовок </v-card-title>
        <v-text-field variant="outlined" v-model="titleRec" name="title"></v-text-field>
        <v-card-subtitle>{{ date }}</v-card-subtitle>
        <v-card-text>Текст записи</v-card-text>
        <v-textarea variant="outlined" name="text" clearable auto-grow v-model="textRec">
        </v-textarea>
        <v-card-actions>
          <v-btn @click="updateData(id), (isActive.value = false)">Сохранить</v-btn>
          <v-spacer></v-spacer>

          <v-btn
            text="Закрыть"
            class="bg-black px-5"
            @click="isActive.value = false"
          ></v-btn>
          <v-btn
            variant="outlined"
            class="ma-2 px-4"
            color="red"
            prepend-icon="mdi-cancel"
            @click="$emit('remove'), (isActive.value = false)"
            >Удалить</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
import { getDatabase, ref, update } from "firebase/database";
export default {
  data() {
    return {
      dateRec: {
        day: "",
        time: "",
        weekday: "",
      },
      textRec: this.text,
      titleRec: this.title,
      tagsRec: this.tags,
    };
  },
  props: ["title", "text", "date", "tags", "id"],
  inject: ["uid"],
  methods: {
    async updateData(id) {
      const db = getDatabase();
      const userId = await this.uid();
      const newRecord = {
        tagsRec: this.tagsRec.length > 0 ? this.tagsRec.join() : "без тегов",
        dateRecord: this.date,
        textRecord: this.textRec,
        title: this.titleRec,
      };
      return update(ref(db, `records/${userId}/${id}`), newRecord);
    },
  },
  computed: {
    dateForRecord() {
      const newD = this.date.split(",");
      return {
        weekday: newD[0],
        day: newD[1].split(".")[0] + "." + newD[1].split(".")[1],
        time: newD[2],
      };
    },
  },
};
</script>

<style></style>
