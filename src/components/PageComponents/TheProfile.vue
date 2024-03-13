<template>
  <v-card-title class="text-h4" primary-title>Профиль </v-card-title>
  <v-card-item class="">
    <v-card-title class="">Имя: {{ firstName }}</v-card-title>
    <v-card-subtitle class="">Email: {{ email }}</v-card-subtitle>
  </v-card-item>
  <v-card-item>
    <v-card-title>Статистика</v-card-title>
    <v-card-text>Количество записей : </v-card-text>
  </v-card-item>
</template>
<script>
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
export default {
  data() {
    return {
      firstName: "",
      email: "",
      recordLen: this.rec,
    };
  },

  mounted() {
    setTimeout(() => {
      this.info();
    }, 600);
  },

  methods: {
    async info() {
      const userId = await this.getUid();
      const db = getDatabase();
      try {
        const dbInfo = ref(db, "users/" + userId + "/info/");
        onValue(dbInfo, (snapshot) => {
          const data = snapshot.val();

          this.firstName = data.name;
          this.email = data.email;
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getUid() {
      const user = getAuth().currentUser;
      return user ? user.uid : null;
    },
  },
};
</script>
