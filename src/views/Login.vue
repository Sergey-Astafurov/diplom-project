<template>
  <v-container class="h-screen">
    <v-layout full-height>
      <v-app-bar class="bg-grey-darken-4 text-h4 text-indigo-lighten-5 pl-3"
        >ТакиеДела</v-app-bar
      >
      <v-main>
        <v-row>
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title primary-title>
                Для проверки <br />
                Login : admin@ad.admin <br />
                Password : 123456 <br />
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="h-100" no-gutters>
          <v-col class="form px-6" sm="12" xs="12" lg="4" md="6" xl="3">
            <the-login />
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </v-container>
</template>
<script>
import TheLogin from "@/components/PageComponents/TheLogin.vue";
export default {
  data() {},
  components: {
    TheLogin,
  },
};
</script>
<style></style>
