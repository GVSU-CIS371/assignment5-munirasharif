import { defineStore } from "pinia";
import type { User } from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import tempretures from "../data/tempretures.json";
import db from "../firebase";
import type {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],

    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,

    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,

    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,

    name: "",

    savedBeverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,

    user: null as User | null,
    unsubscribeBeverages: null as null | (() => void),
  }),

  actions: {
    async init() {
      const [baseSnap, creamerSnap, syrupSnap] = await Promise.all([
        getDocs(collection(db, "bases")),
        getDocs(collection(db, "creamers")),
        getDocs(collection(db, "syrups")),
      ]);

      this.bases = baseSnap.docs.map((d) => d.data() as BaseBeverageType);
      this.creamers = creamerSnap.docs.map((d) => d.data() as CreamerType);
      this.syrups = syrupSnap.docs.map((d) => d.data() as SyrupType);

      this.currentBase = this.bases[0];
      this.currentCreamer = this.creamers[0];
      this.currentSyrup = this.syrups[0];
    },

    setUser(user: User | null) {
      if (this.unsubscribeBeverages) {
        this.unsubscribeBeverages();
        this.unsubscribeBeverages = null;
      }

      this.user = user;

      if (!user) {
        this.savedBeverages = [];
        this.currentBeverage = null;
        return;
      }

      const q = query(
        collection(db, "beverages"),
        where("userId", "==", user.uid)
      );

      this.unsubscribeBeverages = onSnapshot(q, (snapshot) => {
        const beverages = snapshot.docs.map((d) => d.data() as BeverageType);
        this.savedBeverages = beverages;

        if (beverages.length === 0) {
          this.currentBeverage = null;
          return;
        }

        const stillSelected = this.currentBeverage
          ? beverages.find((b) => b.id === this.currentBeverage?.id)
          : null;

        if (stillSelected) {
          this.currentBeverage = stillSelected;
        } else {
          this.showBeverage(beverages[0]);
        }
      });
    },

    async makeBeverage() {
      if (!this.user) {
        return "No user logged in, please sign in first.";
      }
      if (
        !this.name.trim() ||
        !this.currentBase ||
        !this.currentCreamer ||
        !this.currentSyrup
      ) {
        return "Please complete all beverage options and the name before making a beverage.";
      }

      const beverage: BeverageType = {
        id: `bev_${Date.now()}`,
        name: this.name.trim(),
        temp: this.currentTemp,
        base: this.currentBase,
        creamer: this.currentCreamer,
        syrup: this.currentSyrup,
        userId: this.user.uid,
      };

      await setDoc(doc(db, "beverages", beverage.id), beverage);

      this.currentBeverage = beverage;

      if (!this.savedBeverages.find((b) => b.id === beverage.id)) {
        this.savedBeverages = [...this.savedBeverages, beverage];
      }

      this.name = "";

      return `Beverage ${beverage.name} made successfully!`;
    },

    showBeverage(beverage: BeverageType) {
      this.currentBeverage = beverage;
      this.currentTemp = beverage.temp;
      this.currentBase = beverage.base;
      this.currentCreamer = beverage.creamer;
      this.currentSyrup = beverage.syrup;
      this.name = beverage.name;
    },
  },
});