import { httpClient } from "./baseAxios";

export default {
  async register(data: any) {
    return httpClient.post("/api/v1/Auth/register", data);
  },

  async login(data: any) {
    return httpClient.post("/api/v1/Auth/authenticate", data);
  }
};
