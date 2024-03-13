<template>
  <v-container fluid>
    <v-row align="center" justify="start">
      <v-col v-for="(selection, i) in selectionsTags" :key="selection[i]" cols="auto">
        <v-chip closable @click:close="this.selected.splice(i, 1)">
          {{ selection }}
        </v-chip>
      </v-col>
      <v-col cols="12">
        <v-list class="d-flex">
          <template v-for="(tag, i) in this.tags">
            <v-list-item
              v-if="!selected.includes(tag)"
              :key="i"
              @click="selected.push(tag)"
            >
              <v-list-item-title>{{ tag.tag }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["tags", "selected", "selectionsTags"],
  methods: {},
  computed: {

  },
};
</script>
