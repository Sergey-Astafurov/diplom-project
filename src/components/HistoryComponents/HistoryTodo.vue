<template>
  <v-card>
    <v-card-title class="mt-8 text-h4 pt-0"> История всех дел </v-card-title>
    <v-card-text class="mt-8 text-h6"
      >Тут ведется вся статистика выполненых и невыполненых дел по датам
    </v-card-text>
    <v-divider class="mb-8 border-opacity-50"></v-divider>
    <div class="ok px-10" v-if="todosList.length">
      <v-card
        variant="outlined"
        class="pa-5 my-5"
        v-for="(todo, index) in todosList"
        :key="index"
      >
        <div class="w-100 d-flex justify-space-between">
          <v-card-text class="pa-0 text-h6">{{ todo.date }} </v-card-text>
          <v-card-title class="d-block w-10"
            >Количество дел : {{ todo.todos.length }}</v-card-title
          >
        </div>
        <v-divider></v-divider>
        <v-card-item>
          <v-card-text v-for="(item, index) in todo.todos" :key="index">
            <div class="d-flex justify-space-between pb-2">
              <v-card-title> {{ index + 1 }}. {{ item.title }} </v-card-title>
              <v-icon
                v-if="item.isComplete"
                color="success"
                icon="mdi-check-bold"
              ></v-icon>
              <v-icon v-else color="red" icon="mdi-window-close"></v-icon>
            </div>
            <v-divider :thickness="2" class="border-opacity-25" color="info"></v-divider>
          </v-card-text>
        </v-card-item>
      </v-card>
    </div>
    <div class="" v-else>
      <v-card-title> ...Пожалуйста подождите, идет Загрузка </v-card-title>
    </div>
  </v-card>
</template>
<script>
import { getDatabase, ref, onValue } from "firebase/database";
export default {
  props: ["uid"],
  data() {
    return {
      todosList: [],
    };
  },

  async mounted() {
    await setTimeout(() => {
      Promise.all([this.loadHistory()]);
    }, 1000);
  },

  methods: {
    async loadHistory() {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const toDosRef = ref(db, `todos/${userId}/`);
        onValue(toDosRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.todosList = Object.keys(data).map((key) => {
              return {
                date: key,
                todos: Object.keys(data[key]).map((id) => {
                  return {
                    todoId: id,
                    title: data[key][id].titleTodoItem,
                    text: data[key][id].textTodoItem,
                    isComplete: data[key][id].todoIsComplete,
                    isFaled: data[key][id].todoIsFaled,
                  };
                }),
              };
            });
            this.todosList = this.todosList.reverse();
          }
        });
      } catch (error) {}
    },
    isComp(item) {
      return item.isComplete == true
        ? "mdi-checkbox-marked-circle"
        : "mdi-checkbox-marked-circle";
    },
  },
  computed: {},
};
</script>
<style lang=""></style>
