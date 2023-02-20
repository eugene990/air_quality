import axios, { isAxiosError } from 'axios';
import { ExternalServiceError, UnexpectedError } from '../../helpers/api-errors';
import { AirQuality } from './air-quality.interface';

const iqAirApiKey = process.env.IQAIR_API_KEY as string;

export class IQAirService {
  private url: string;

  private apiKey: string;

  constructor() {
      this.url = 'https://api.airvisual.com';
      this.apiKey = iqAirApiKey;
  }

  async getAirQuality(longitude: number, latitude: number): Promise<AirQuality> {
      try {
        const result = await axios.get(
          `${this.url}/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${ this.apiKey }`);

        return {
          city: result.data.data.city,
          ts: result.data.data.current.pollution.ts,
          aqius: result.data.data.current.pollution.aqius,
          mainus: result.data.data.current.pollution.mainus,
          aqicn: result.data.data.current.pollution.aqicn,
          maincn: result.data.data.current.pollution.maincn,
        };
        
      } catch(e) {
        if (isAxiosError(e)) {
          if (e.response) {
            console.error("IQAirService.getAirQuality: ", {
              longitude,
              latitude,
              status:  e.response?.status,
              data:  e.response?.data
            });
            throw new ExternalServiceError("An error occurred while searching nearest city");
          }
        }
        
        console.error("IQAirService.getAirQuality UnexpectedError: ", {
          longitude,
          latitude
        });
        throw new UnexpectedError("An error occurred while searching nearest city")
      }
    }
}
