<template>
  <v-dialog width="800">
    <template v-slot:activator="{ props }">
      <v-btn
        class="btn-action ma-5"
        variant="outlined"
        v-bind="props"
        :prepend-icon="icon"
        text="добавить"
      >
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="Добавить дело" class="pa-5">
        <v-card-text primary>
          Чтобы добавить дело введите заголовок и текст дела
        </v-card-text>
        <v-form class="px-5" @submit.prevent="addTodosItem">
          <v-text-field
            autofocus
            variant="outlined"
            v-model="todo.title"
            label="Заголовок"
          ></v-text-field>
          <v-textarea
            variant="outlined"
            v-model="todo.text"
            type="text"
            :counter="400"
            label="Текст"
          ></v-textarea>

          <v-btn
            @click="isActive.value = false"
            type="submit"
            text="Добавить"
            :disabled="todo.title.length < 2"
          ></v-btn>
        </v-form>
      </v-card>
    </template>
  </v-dialog>
  <v-snackbar color="success" elevation="24" v-model="snackbarAddTodo" timeout="2000">
    Дело добавлено
  </v-snackbar>
</template>
<script>
import { getDatabase, ref, set, child, push, update } from "firebase/database";

export default {
  inject: ["uid"],
  props: ["date", "formated"],
  data() {
    return {
      icon: "mdi-plus",
      todo: {
        title: "",
        text: "",
      },

      snackbarAddTodo: false,
    };
  },
  methods: {
    addTodosItem() {
      this.writeUserTodo(this.todo);
      this.todo.title = "";
      this.todo.text = "";
      this.snackbarAddTodo = true;
    },
    async writeUserTodo({ title, text }) {
      const userId = await this.uid();
      const db = await getDatabase();
      const todoData = {
        titleTodoItem: title,
        textTodoItem: text || "без описания",
        todoIsComplete: false,
        todoIsFaled: true,
      };
      const dateKey = this.formated;
      const newTodoKey = push(child(ref(db), "todos")).key;
      const updates = {};
      updates[`/todos/${userId}/${dateKey}/${newTodoKey}`] = todoData;
      return update(ref(db), updates);
    },
  },
};
</script>
<style lang=""></style>
