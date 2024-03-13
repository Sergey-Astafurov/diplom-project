<template>
  <v-layout full-height>
    <v-app>
      <v-container>
        <the-header :dateh="dateFilter" />
        <the-navbar :fname="infoUser.name" :email="infoUser.email" />
        <v-main>
          <router-view></router-view>
        </v-main>
      </v-container>
    </v-app>
  </v-layout>
</template>
<script>
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import TheHeader from "@/components/PageComponents/TheHeader.vue";
import TheNavbar from "@/components/PageComponents/TheNavbar.vue";

export default {
  data() {
    return {
      firstName: "",
      email: "",
      phone: "",
      interval: null,
      date: new Date(),
      newDate: this.date,
    };
  },

  async mounted() {
    setTimeout(() => {
      this.info();
    }, 400);

    this.interval = setInterval(() => {
      this.date = new Date();
    }, 1000);
  },

  methods: {
    async info() {
      const userId = await this.getUid();
      const db = getDatabase();
      try {
        const dbInfo = ref(db, "users/" + userId + "/info/");
        onValue(
          dbInfo,
          (snapshot) => {
            if (snapshot) {
              const name = snapshot.val() && snapshot.val().name;
              const email = snapshot.val() && snapshot.val().email;
              this.firstName = name;
              this.email = email;
              console.log(snapshot.val());
            }
          },
          { onlyOnce: true }
        );
      } catch (error) {
        console.log(error);
      }
    },

    async getUid() {
      const user = getAuth().currentUser;
      return user ? user.uid : null;
    },
  },
  computed: {
    dateForRecord() {
      this.newDate = this.dateFilter.split(",");
    },
    infoUser() {
      return {
        name: this.firstName,
        email: this.email,
      };
    },
    dateFilter() {
      const option = {
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
        month: "numeric",
        day: "numeric",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("ru-RU", option).format(new Date(this.date));
    },
  },
  provide() {
    return {
      uid: this.getUid,
      date: this.dateFilter,
    };
  },
  components: {
    TheHeader,
    TheNavbar,
  },
};
</script>
<style scoped>
.btn-action {
  width: 200px;
  height: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
