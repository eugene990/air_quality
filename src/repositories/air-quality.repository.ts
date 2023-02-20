import { ResourceNotFound } from "../helpers/api-errors";
import { AirQualityEntity } from "../entities/air-quality.entity";
import { AirQuality } from "../services/iqair/air-quality.interface";

export class AirQualityRepository {
  async create(airQuality: AirQuality) {
    const newAirQuality = new AirQualityEntity();

    newAirQuality.ts = airQuality.ts;
    newAirQuality.aqius = airQuality.aqius;
    newAirQuality.mainus = airQuality.mainus;
    newAirQuality.aqicn = airQuality.aqicn;
    newAirQuality.maincn = airQuality.maincn;
    newAirQuality.city = airQuality.city;
    newAirQuality.datetime = new Date();

    await newAirQuality.save();
  }

  async getMostPolluted(city: string) {
    const airQuality = await AirQualityEntity.findOne({ 
      where: { city },
      order: { aqius: "DESC" }
     })

    if (!airQuality) {
      throw new ResourceNotFound("city not found");
    }

    return airQuality.datetime;
  }
}