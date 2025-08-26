import axios from "axios";
import countriesCsv from "../data/countries.csv?raw"; // your CSV file inside src/data/

// Parse CSV into { codes[], map{} }
const lines = countriesCsv
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const supportedCountries = lines.map((line) => line.split(",")[0]); // just codes
const countryMap = Object.fromEntries(
  lines.map((line) => {
    const [code, name] = line.split(",");
    return [code, name];
  })
);

export class Passport {
  constructor(cc) {
    this.cc = cc.toUpperCase();

    this.visaFree = [];
    this.visaOnArrival = [];
    this.eta = [];
    this.eVisa = [];
    this.visaRequired = [];
    this.notAdmitted = [];
    this.covidBan = [];
  }

  // ✅ just checks if code exists in supportedCountries
  static isSupported(cc) {
    return supportedCountries.includes(cc.toUpperCase());
  }

  static make(cc) {
    if (!Passport.isSupported(cc)) {
      throw new Error(`${cc} is unsupported country`);
    }
    return new Passport(cc);
  }

  // ✅ fetch passport index data and categorize
  async get() {
    const result = await this.fetchData();

    for (const item of result) {
      const code = item.code;
      switch (item.text) {
        case "visa-free":
          this.visaFree.push(code);
          break;
        case "visa on arrival":
          this.visaOnArrival.push(code);
          break;
        case "eTourist":
        case "eVisa":
        case "pre-enrollment": // Ivory Coast
        case "visa-free (EASE)":
        case "visa on arrival / eVisa":
          this.eVisa.push(code);
          break;
        case "eTA":
        case "tourist registration": // Seychelles
          this.eta.push(code);
          break;
        case "not admitted":
          this.notAdmitted.push(code);
          break;
        case "COVID-19 ban":
          this.covidBan.push(code);
          break;
        default:
          this.visaRequired.push(code);
          break;
      }
    }

    return this.toArray();
  }

  listVisaFree() {
    return this.visaFree;
  }
  listVisaOnArrival() {
    return this.visaOnArrival;
  }
  listEta() {
    return this.eta;
  }
  listEVisa() {
    return this.eVisa;
  }
  listVisaRequired() {
    return this.visaRequired;
  }
  listNotAdmitted() {
    return this.notAdmitted;
  }
  listCovidBan() {
    return this.covidBan;
  }

  toArray() {
    return {
      "visa-free": this.listVisaFree(),
      "visa-on-arrival": this.listVisaOnArrival(),
      "electronic-travel-authorization": this.listEta(),
      "e-visa": this.listEVisa(),
      "visa-required": this.listVisaRequired(),
      "not-admitted": this.listNotAdmitted(),
      "covid-ban": this.listCovidBan(),
    };
  }

  async fetchData() {
    const endpoint = "https://www.passportindex.org/incl/compare2.php";

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: "https://www.passportindex.org",
      referer: "https://www.passportindex.org/comparebyPassport.php",
      host: "www.passportindex.org",
      "X-Requested-With": "XMLHttpRequest",
    };

    const formData = new URLSearchParams();
    formData.append("compare", "3");
    formData.append("year", new Date().getFullYear().toString());
    formData.append("cc", this.cc);

    const response = await axios.post(endpoint, formData, { headers });
    return response.data;
  }

  // ✅ helper if you want to show full country name
  static getCountryName(cc) {
    return countryMap[cc.toUpperCase()] || null;
  }

  static allCountries() {
    return countryMap; // { CC: "Country Name", ... }
  }
}
