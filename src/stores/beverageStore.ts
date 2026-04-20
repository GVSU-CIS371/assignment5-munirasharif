import { defineStore } from "pinia";
import tempretures from "../data/tempretures.json";
import bases from  "../data/bases.json"
import creamers from "../data/creamers.json"
import syrups from "../data/syrups.json"

export interface BaseBeverageType {
  id: string;
  name: string;
  color: string;
}

export interface CreamerType {
  id: string;
  name: string;
  color: string;
}

export interface SyrupType {
  id: string;
  name: string;
  color: string;
}

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: bases,
    currentBase: bases[0],
    creamers: creamers,
    currentCreamer: creamers[0],
    syrups: syrups,
    currentSyrup: syrups[0],
    name: "",
    savedBeverages: [] as {
      id: number;
      name: string;
      temp: string;
      base: any;
      creamer: any;
      syrup: any;
    }[],
    next: 0,
  }),

  actions: {
    makeBeverage() {
      this.savedBeverages.push({
        id: this.next,
        name: this.name,
        temp: this.currentTemp,
        base: this.currentBase,
        creamer: this.currentCreamer,
        syrup: this.currentSyrup
      });
      this.next++;
      this.name = "";
    },
    showBeverage(beverage: {
      id: number;
      name: string;
      temp: string;
      base: any;
      creamer: any;
      syrup: any;
    }) {
      this.currentTemp = beverage.temp;
      this.currentBase = beverage.base;
      this.currentCreamer = beverage.creamer;
      this.currentSyrup = beverage.syrup;
    },
  },
  persist: true,
});
