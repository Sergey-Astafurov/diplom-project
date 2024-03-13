<template>
  <v-app>
    <v-card>
      <v-tabs v-model="tab" align-tabs="center" grow bg-color="black" variant="outlined">
        <v-tab class="mx-5" value="one">Список дел на сегодня</v-tab>
        <v-tab class="mx-5" value="two">Список дел на завтра</v-tab>
        <v-tab class="mx-5" value="three">История дел</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <today-todos :uid="uid"></today-todos>
          </v-window-item>

          <v-window-item value="two">
            <tomorrow-todos :uid="uid"></tomorrow-todos>
          </v-window-item>

          <v-window-item value="three">
            <history-todo :uid="uid"></history-todo>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-app>
</template>
<script>
import TodayTodos from "@/components/TodosComponents/TodayTodos.vue";
import TomorrowTodos from "@/components/TomorrowTodosComponents/TomorrowTodos.vue";
import HistoryTodo from "@/components/HistoryComponents/HistoryTodo.vue";

export default {
  inject: ["uid"],
  data() {
    return {
      tab: null,
    };
  },
  components: {
    TodayTodos,
    TomorrowTodos,
    HistoryTodo,
  },
};
</script>
<style lang=""></style>
