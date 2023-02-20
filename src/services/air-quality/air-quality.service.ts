import { AirQualityRepository } from '../../repositories/air-quality.repository';
import { AirQuality } from '../iqair/air-quality.interface';
import { IQAirService } from '../iqair/iqair.service';

export class AirQualityService {
  private airQualityRepository: AirQualityRepository;
  private iqAirService: IQAirService;

  constructor() {
    this.airQualityRepository = new AirQualityRepository();
    this.iqAirService = new IQAirService();
  }

  async getAirQuality(longitude: number, latitude: number): Promise<AirQuality> {
    const airQuality = await this.iqAirService.getAirQuality(
      longitude,
      latitude,
    );

    await this.airQualityRepository.create(airQuality);

    return airQuality;
  }

  async getMostPolluted(city: string) {
    const dateTime = await this.airQualityRepository.getMostPolluted(city);

    return `${city} was the most polluted on ${dateTime.toDateString()}`;
  }
}
