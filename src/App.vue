<template>
  <div style="width: 100%; position: relative;">
    <div style="position: fixed; top: 200px; right: 200px; z-index: 20;">
      <div style="text-align: right;">
        <button v-if="!beverageStore.user" @click="withGoogle">
          Sign in with Google
        </button>

        <div
          v-else
          style="display: flex; flex-direction: column; align-items: flex-end;"
        >
          <p>
            Signed in as:
            {{ beverageStore.user.displayName || beverageStore.user.email }}
          </p>
          <button @click="handleSignOut">Sign out</button>
        </div>
      </div>
    </div>

    <p
  v-if="message"
  style="margin-left: -180px; margin-bottom: 12px; text-align: left;"
>
  {{ message }}
</p>

<Beverage
  v-if="
    beverageStore.currentBase &&
    beverageStore.currentCreamer &&
    beverageStore.currentSyrup
  "
  :isIced="beverageStore.currentTemp === 'Cold'"
  :base="beverageStore.currentBase"
  :creamer="beverageStore.currentCreamer"
  :syrup="beverageStore.currentSyrup"
/>

    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="base in beverageStore.bases" :key="base.id">
          <label>
            <input
              type="radio"
              name="base"
              :id="`r${base.id}`"
              :value="base"
              v-model="beverageStore.currentBase"
            />
            {{ base.name }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="creamer in beverageStore.creamers" :key="creamer.id">
          <label>
            <input
              type="radio"
              name="creamer"
              :id="`r${creamer.id}`"
              :value="creamer"
              v-model="beverageStore.currentCreamer"
            />
            {{ creamer.name }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="syrup in beverageStore.syrups" :key="syrup.id">
          <label>
            <input
              type="radio"
              name="syrup"
              :id="`r${syrup.id}`"
              :value="syrup"
              v-model="beverageStore.currentSyrup"
            />
            {{ syrup.name }}
          </label>
        </template>
      </li>
    </ul>

    <input
      type="text"
      placeholder="Beverage Name"
      v-model="beverageStore.name"
    />

    <button :disabled="!beverageStore.user" @click="handleMakeBeverage">
      🍺 Make Beverage
    </button>

    <div
      v-if="beverageStore.user && beverageStore.savedBeverages.length > 0"
      id="beverage-container"
      style="margin-top: 20px"
    >
      <template
        v-for="beverage in beverageStore.savedBeverages"
        :key="beverage.id"
      >
        <label>
          <input
            type="radio"
            name="beverage"
            :id="`r${beverage.id}`"
            :value="beverage"
            @change="beverageStore.showBeverage(beverage)"
          />
          {{ beverage.name }}
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { auth, googleProvider } from "./firebase";

const beverageStore = useBeverageStore();
const message = ref("");

async function withGoogle() {
  try {
    message.value = "";
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
  }
}

async function handleSignOut() {
  try {
    await signOut(auth);
    message.value = "Signed out successfully.";
  } catch (error) {
    console.error(error);
  }
}

async function handleMakeBeverage() {
  message.value = await beverageStore.makeBeverage();
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
}
</style>