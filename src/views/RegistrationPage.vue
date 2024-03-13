<template>
  <v-container class="h-screen">
    <v-layout full-height>
      <v-app-bar class="bg-grey-darken-4 text-h4 text-indigo-lighten-5 pl-3"
        >ТакиеДела</v-app-bar
      >
      <v-main>
        <v-row align="center" justify="center" class="h-100" no-gutters>
          <v-col class="form" cols="4">
            <v-card class="pa-3">
              <v-card-title primary-title> Регистрация </v-card-title>
              <v-form @submit.prevent="submit" align="center" class="pa-3">
                <v-text-field
                  variant="outlined"
                  v-model="name.value.value"
                  :counter="10"
                  :error-messages="name.errorMessage.value"
                  label="Имя"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  type="number"
                  v-model="phone.value.value"
                  :counter="9"
                  :error-messages="phone.errorMessage.value"
                  label="Номер телефона"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  v-model="email.value.value"
                  :error-messages="email.errorMessage.value"
                  label="Почта"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  v-model="password.value.value"
                  type="password"
                  :counter="6"
                  :error-messages="password.errorMessage.value"
                  label="Пароль"
                ></v-text-field>
                <v-row justify="space-around">
                  <v-col cols="12">
                    <v-btn width="100%" type="submit" text="Зарегистрироваться"></v-btn>
                  </v-col>
                  <v-col cols="12">
                    <router-link to="/" custom v-slot="{ navigate, href }">
                      <a @click="navigate" :href="href">
                        <v-btn
                          prepend-icon="mdi-arrow-left"
                          color="grey-darken-4"
                          width="100%"
                          text="Войти в аккаунт"
                        >
                        </v-btn
                      ></a>
                    </router-link>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </v-container>
</template>
<script setup>
// import * as database from 'firebase/database'
import { getDatabase, ref, set } from "firebase/database";
import { useField, useForm } from "vee-validate";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
const router = useRouter();
const { handleSubmit } = useForm({
  validationSchema: {
    name(value) {
      if (value?.length >= 2) return true;

      return "Name needs to be at least 2 characters.";
    },
    phone(value) {
      if (value?.length > 9 && /[0-9-]+/.test(value)) return true;

      return "Phone number needs to be at least 9 digits.";
    },
    email(value) {
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) return true;
      return "Must be a valid e-mail.";
    },
    password(value) {
      if (value?.length >= 6) return true;

      return "Password needs to be at least 6 characters.";
    },
  },
});

const name = useField("name");
const phone = useField("phone");
const email = useField("email");
const password = useField("password");

const submit = handleSubmit((values) => {
  const formData = values;
  createUser(formData);
});

async function getUid() {
  const user = getAuth().currentUser;
  return user ? user.uid : null;
}
async function createUser({ email, name, phone, password }) {
  if (submit) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);

    const uid = await getUid();
    try {
      const db = getDatabase();
      const rf = ref(db, `/users/${uid}/info`);
      set(rf, {
        name,
        phone,
        email,
      });
      router.push("/");
    } catch (error) {}
  }
}
</script>
<style></style>
