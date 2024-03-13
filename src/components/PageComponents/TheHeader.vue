<template>
  <div>
    <v-app-bar class="bg-grey-darken-4 text-h4 text-indigo-lighten-5">
      <v-app-bar-title
        class="text-h4 cursor-pointer"
        @click="this.$router.replace('/home')"
        >ТакиеДела</v-app-bar-title
      >
      <v-spacer></v-spacer>
      <div class="time text-body-1 pr-5">
        <div class="time text-body-1 pr-5">
          {{ dateh }}
        </div>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  props: ["dateh"],
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style></style>
