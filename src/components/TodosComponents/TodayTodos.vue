<template>
  <v-card>
    <v-card-title class="mt-8 text-h4"> Список дел на сегодня </v-card-title>
    <v-divider class="mb-8"></v-divider>
    <div class="item" v-if="todos.length">
      <todo-item
        v-for="(todo, i) in todos"
        :key="todo.id"
        @remove="removeTodo(todo.id)"
        @todo-is-comlete="completeTodo(todo)"
        :todo="todo"
      ></todo-item>
    </div>

    <div class="els" v-else>
      <v-card variant="outlined" class="my-5">
        <v-card-title class="text-center pa-5"> Дел на сегодня нет! </v-card-title>
      </v-card>
    </div>
    <v-divider class="border-opacity-50" :thickness="2"></v-divider>
    <add-today-todos :date="date" :formated="formated"></add-today-todos>
  </v-card>
</template>
<script>
import AddTodayTodos from "./AddTodayTodos.vue";
import TodoItem from "./TodoItem.vue";

import {
  getDatabase,
  ref,
  onValue,
  remove,
  update,
} from "firebase/database";
import { useDate } from "vuetify";

export default {
  props: ["uid"],
  data() {
    return {
      date: useDate().date(),
      formated: useDate().format(this.date, "keyboardDate").replaceAll("/", "-"),
      todos: [],
    };
  },
  async mounted() {
    await setTimeout(() => {
      Promise.all([this.loadTodos(), this.loadHistory()]);
      this.isOk = true;
    }, 1000);
  },
  methods: {
    async removeTodo(id) {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const todoItem = this.todos.find((todo) => todo.id === id).id;
        remove(ref(db, `todos/${userId}/${this.formated}/${todoItem}`));
        this.todos = this.todos.filter((todo) => {
          return todo.id !== id;
        });
      } catch (error) {}
    },
    async completeTodo(todo) {
      const db = getDatabase();
      const userId = await this.uid();
      const todoData = {
        titleTodoItem: todo.title,
        textTodoItem: todo.text,
        todoIsComplete: true,
        todoIsFaled: false,
      };
      const dateKey = this.formated;
      const updates = {};
      // this.todos = this.todos.filter((todoItem) => todoItem.id !== todo.id);
      updates[`/todos/${userId}/${dateKey}/${todo.id}`] = todoData;
      console.log("data update");
      return update(ref(db), updates);
    },

    async loadTodos() {
      const db = getDatabase();
      const userId = await this.uid();
      try {
        const toDosRef = ref(db, `todos/${userId}/${this.formated}`);
        onValue(toDosRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.todos = Object.keys(data).map((key) => {
              return {
                id: key,
                title: data[key].titleTodoItem,
                text: data[key].textTodoItem,
                isComplete: data[key].todoIsComplete,
                isFaled: data[key].todoIsFaled,
              };
            });
            this.todos = this.todos.reverse().filter((todo) => todo.isComplete == false);
          }
        });
      } catch (error) {}
    },
    loadHistory() {
    },
  },

  components: { AddTodayTodos, TodoItem },
};
</script>
<style lang=""></style>
