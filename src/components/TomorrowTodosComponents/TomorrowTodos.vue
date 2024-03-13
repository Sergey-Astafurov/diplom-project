<template>
  <v-card max-height="1000">
    <v-card-title class="mt-8 text-h4"> Список дел на завтра </v-card-title>
    <v-divider class="mb-8"></v-divider>

    <div class="item" v-if="tomorrowTodos.length">
      <tomorrow-todo-item
        v-for="(todo, i) in tomorrowTodos"
        :key="todo.id"
        @remove="removeTodo(todo.id)"
        :todo="todo"
      ></tomorrow-todo-item>
    </div>

    <div class="els" v-else>
      <v-card variant="outlined" class="my-5">
        <v-card-title class="text-center pa-5">
          Дел на завтра нет! Отдыхаем!
        </v-card-title>
      </v-card>
    </div>
    <add-today-todos :date="date" :formated="formated"></add-today-todos>
  </v-card>
</template>

<script>
import todoItem from "../TodosComponents/TodoItem.vue";
import TomorrowTodoItem from "./TomorrowTodoItem.vue";
import {
  getDatabase,
  ref,
  onValue,
  remove,

} from "firebase/database";
import AddTodayTodos from "../TodosComponents/AddTodayTodos.vue";
import { useDate } from "vuetify";
export default {
  props: ["uid"],
  data() {
    return {
      tomorrowTodos: [],
      date: useDate().date(),
      formated: useDate()
        .format(useDate().addDays(useDate().date(), 1), "keyboardDate")
        .replaceAll("/", "-"),
    };
  },
  async mounted() {
    await setTimeout(() => {
      Promise.all([this.loadTomorrowTodos()]);
      this.isOk = true;
    }, 1000);
  },
  methods: {
    async loadTomorrowTodos() {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const toDosRef = ref(db, `todos/${userId}/${this.formated}`);
        onValue(toDosRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.tomorrowTodos = Object.keys(data).map((key) => {
              return {
                id: key,
                title: data[key].titleTodoItem,
                text: data[key].textTodoItem,
                isComplete: data[key].todoIsComplete,
                isFaled: data[key].todoIsFaled,
              };
            });
            this.tomorrowTodos = this.tomorrowTodos.reverse();
          }
        });
      } catch (error) {}
    },
    async removeTodo(id) {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const todoItem = this.tomorrowTodos.find((todo) => todo.id === id).id;
        remove(ref(db, `todos/${userId}/${this.formated}/${todoItem}`));
        this.tomorrowTodos = this.tomorrowTodos.filter((todo) => {
          return todo.id !== id;
        });
      } catch (error) {}
    },
  },
  components: {
    todoItem,
    AddTodayTodos,
    TomorrowTodoItem,
  },
};
</script>
<style lang=""></style>
