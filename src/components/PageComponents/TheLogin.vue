<template>
  <v-form @submit.prevent="submit" align="center">
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
        <v-btn width="100%" type="submit" text="Войти"></v-btn>
      </v-col>
      <v-col cols="12">
        <router-link to="/registration" custom v-slot="{ navigate, href }">
          <a @click="navigate" :href="href">
            <v-btn color="grey-darken-4" width="100%" text="Регистрация"> </v-btn
          ></a>
        </router-link>
      </v-col>
    </v-row>
  </v-form>
</template>
<script setup>
import { useField, useForm } from "vee-validate";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const { handleSubmit } = useForm({
  validationSchema: {
    email(value) {
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]/i.test(value)) return true;
      return "Must be a valid e-mail.";
    },
    password(value) {
      if (value?.length >= 6) return true;
      return "Password needs to be at least 6 characters.";
    },
  },
});

const email = useField("email");
const password = useField("password");
const router = useRouter();
const submit = handleSubmit((values) => {
  const formData = values;
  login(formData);
});
async function login({ email, password }) {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/home/profile");
  } catch (e) {}
}
</script>
