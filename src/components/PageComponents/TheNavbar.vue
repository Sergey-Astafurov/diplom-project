<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list density="compact" nav>
      <router-link to="/home/profile" custom v-slot="{ navigate, href }">
        <v-list-item @click="navigate" :to="href" value="profile">
          <v-list-item-title>{{ fname }}</v-list-item-title>
          <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
        </v-list-item>
      </router-link>
      <router-link to="/home/diary" custom v-slot="{ navigate, href }">
        <v-list-item
          prepend-icon="mdi-folder"
          @click="navigate"
          :to="href"
          title="Мой дневник"
          value="mydiary"
        >
        </v-list-item>
      </router-link>
      <router-link to="/home/todo" custom v-slot="{ navigate, href }">
        <v-list-item
          @click="navigate"
          :to="href"
          prepend-icon="mdi-calendar-check"
          title="Список дел"
          value="todo"
        ></v-list-item>
      </router-link>
      <v-divider></v-divider>
      <v-list-item
        @click="logout"
        prepend-icon="mdi-arrow-left"
        title="Выход"
        value="exit"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { signOut, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

async function logout() {
  const auth = getAuth();
  router.replace("/");
  await signOut(auth);
}
</script>

<script>
export default {
  props: ["fname", "email"],
};
</script>
<style lang=""></style>
