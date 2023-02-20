import { AirQuality } from "../iqair/air-quality.interface";

export const getAirQualityPresenter = (airQuality: AirQuality) => {
  return {
    Result: {
      Pollution: {
        ts: airQuality.ts,
        aqius: airQuality.aqius,
        mainus: airQuality.mainus,
        aqicn: airQuality.aqicn,
        maincn: airQuality.maincn,
      }
    },
  }
};
