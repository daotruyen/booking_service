import { httpClient } from "./baseAxios";

export default {
  async testToken() {
    return httpClient.get("/api/v1/WeatherForecast/test_token");
  }
};
