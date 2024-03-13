<template>
  <v-dialog width="700" class="ma-5">
    <template v-slot:activator="{ props }">
      <v-card v-bind="props" class="my-5" variant="outlined" hover max-height="200">
        <v-card-item loading="lazy" class="d-flex pa-3">
          <div class="d-flex">
            <v-divider :thickness="5" color="black" vertical></v-divider>
            <div class="pl-3 pa-3 d-flex flex-column">
              <v-card-text class="pa-0 mb-3 text-h6">
                {{ todo.title }}
              </v-card-text>
            </div>
          </div>
        </v-card-item>
      </v-card>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="pa-5">
        <v-card-title primary-title> {{ todo.title }} </v-card-title>
        <v-card-subtitle>{{ todo.text }}</v-card-subtitle>

        <v-card-actions>
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
            @click="$emit('remove')"
            >Удалить</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
export default {
  props:["todo"],
  emits: ["remove"],
  data() {
    return {};
  },
};
</script>
<style></style>
