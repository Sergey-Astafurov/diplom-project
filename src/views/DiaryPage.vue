<template>
  <v-container fluid>
    <v-row>
      <v-col cols="10" class="mx-auto">
        <v-card variant="outlined" class="pa-4">
          <v-card-title>
            Сортировка

            <v-divider thickness="2" class="border-opacity-50" color="info"> </v-divider>
          </v-card-title>
          <v-card-item>
            <h3 class="mr-3" v-if="!checkTags">Список тегов пуст</h3>
            <div class="content d-flex flex-wrap">
              <v-chip
                @click="filterRecord((selectTag = ''))"
                hover
                variant="outlined"
                color="primary"
                class="pa-4 ma-1"
                >Все</v-chip
              >
              <v-chip
                hover
                closable
                @click:close="removeTag(tag.tag)"
                @click="filterRecord(tag.tag)"
                variant="outlined"
                color="primary"
                class="pa-4 ma-1"
                v-for="(tag, i) in tags"
                :key="tag.id"
                >{{ tag.tag }}
              </v-chip>
              <v-chip
                @click="filterRecord('без тегов')"
                hover
                variant="outlined"
                color="primary"
                class="pa-4 ma-1"
                >Без тегов</v-chip
              >
            </div>
            <v-snackbar color="info" elevation="24" v-model="snackBarTags" timeout="2000">
              Тег удален
            </v-snackbar>
          </v-card-item>

          <v-card-item>
            <v-dialog width="500">
              <template v-slot:activator="{ props }">
                <v-btn
                  flat
                  small
                  color="black"
                  class="mb-3"
                  v-bind="props"
                  text="Добавить теги"
                >
                </v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Добавить теги">
                  <v-card-text>
                    Теги нужны для сортировки и обозначения своих записей. Например чтобы
                    вывести все записи которые вы связали с тегом "Дом"
                  </v-card-text>
                  <v-form class="ma-5" @submit.prevent="createTag">
                    <v-text-field
                      autofocus
                      variant="outlined"
                      name="tag"
                      label="Тег"
                      v-model="tag.name"
                      id="id"
                    ></v-text-field>

                    <v-btn
                      :disabled="tag.name.length < 2"
                      type="submit"
                      text="Сохранить"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-form>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-card-item>
          <v-divider> </v-divider>
          <v-card-title class="pa-3">
            Всего записей записей: {{ records.length }}
          </v-card-title>
        </v-card>
        <div v-if="isOk">
          <record-item
            class="my-5"
            v-for="record in filterRec"
            :key="record.id"
            :id="record.id"
            :title="record.title"
            :text="record.text"
            :date="record.date"
            :tags="record.tags"
            @remove="removeRecord(record.id)"
          ></record-item>
          <v-snackbar color="info" elevation="24" v-model="snackBarRecord" timeout="2000"
            >Запись удалена
          </v-snackbar>
        </div>
        <v-card v-else class="pa-8 mt-5" variant="outlined">
          <v-card-title primary-title> ...Загрузка данных </v-card-title>
        </v-card>
        <v-card v-if="notRecTags" class="pa-8 mt-5" variant="outlined">
          <v-card-title primary-title>
            {{ `Записей с тегом ${selectTag} пока нет! ` }}
          </v-card-title>
        </v-card>
        <add-record-btn :date="date" :tags="fullTags"></add-record-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AddRecordBtn from "@/components/DiaryComponents/AddRecordBtn.vue";
import RecordItem from "@/components/DiaryComponents/RecordItem.vue";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  child,
  push,
  update,
} from "firebase/database";
export default {
  data() {
    return {
      snackBarTags: false,
      snackBarRecord: false,
      tag: {
        name: "",
      },

      filterToTags: [],
      records: [],
      tags: [],
      isOk: false,
      isLength: 0,
      isTags: false,
      notRecTags: false,
      selectTag: "",
    };
  },
  async mounted() {
    await setTimeout(() => {
      Promise.all([this.loadTags(), this.loadRecords()]);
      this.isOk = true;
    }, 1000);
  },
  inject: ["uid", "date"],

  methods: {
    filterRecord(tag) {
      this.filterToTags = [];
      this.selectTag = tag;
      this.records.map((item) => {
        if (item.tags.includes(tag)) {
          this.filterToTags.push(item);
        }
      });
      this.notRecTags = false;
    },
    createTag() {
      this.addTags(this.tag);
      this.tag.name = "";
    },

    async addTags({ name }) {
      const db = getDatabase();
      const userId = await this.uid();
      const tagData = {
        tagName: name,
      };
      const newTagKey = push(child(ref(db), "tags/")).key;
      const updates = {};
      updates[`/tags/${userId}/` + newTagKey] = tagData;
      return update(ref(db, `tags/${userId}/${newTagKey}/`), tagData);
    },

    async loadTags() {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const tagsRef = await ref(db, `tags/${userId}/`);
        await onValue(tagsRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.isTags = true;
            this.tags = Object.keys(data).map((key) => {
              return {
                id: key,
                tag: data[key].tagName,
              };
            });
          } else {
            return (this.isTags = false);
          }
        });
      } catch (error) {}
    },
    async removeTag(tagName) {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const tag = this.tags.find((tag) => tag.tag === tagName).id;
        remove(ref(db, `tags/${userId}/${tag}`));
        this.tags = this.tags.filter((tag) => {
          return tag.tag !== tagName;
        });
        this.snackBarTags = true;
      } catch (error) {}
    },
    async loadRecords() {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const recordsRef = ref(db, `records/${userId}/`);
        onValue(recordsRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.isLength = 0;
            this.records = Object.keys(data).map((key) => {
              return {
                id: key,
                title: data[key].title,
                text: data[key].textRecord,
                date: data[key].dateRecord,
                tags: data[key].tagsRecord,
              };
            });
            this.records = this.records.reverse();
          } else {
            return (this.isLength = 1);
          }
        });
      } catch (error) {}
    },
    async removeRecord(id) {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const record = this.records.find((record) => record.id === id).id;
        console.log(record);
        remove(ref(db, `records/${userId}/${record}`));
        this.records = this.records.filter((record) => {
          return record.id !== id;
        });
        this.filterToTags = this.filterToTags.filter((record) => {
          return record.id !== id;
        });
        this.snackBarRecord = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    fullTags() {
      return this.tags;
    },
    checkTags() {
      return this.tags.length > 0 ? true : false;
    },
    checkRecord() {
      return this.records.length > 0 ? true : false;
    },
    filterRec() {
      if (this.filterToTags.length && this.selectTag !== "") {
        return this.filterToTags;
      } else if (this.selectTag === "") {
        return this.records;
      } else {
        return (this.notRecTags = true);
      }
    },
  },

  components: { RecordItem, AddRecordBtn },
};
</script>
<style lang=""></style>
