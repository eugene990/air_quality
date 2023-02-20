import { AirQualityRepository } from '../../../src/repositories/air-quality.repository';
import { AirQualityService } from '../../../src/services/air-quality/air-quality.service';
import { IQAirService } from '../../../src/services/iqair/iqair.service';

const pollutionResponse = {
  city: "Olawa",
  ts: "2023-02-20T15:00:00.000Z",
  aqius: 21,
  mainus: "p2",
  aqicn: 7,
  maincn: "p2",
};

const mostPollutionResponse = `Olawa was the most polluted on Mon Feb 20 2023`;

describe('AirQualityService', () => {
  let airQualityService: AirQualityService;

  beforeEach(() => {
    airQualityService = new AirQualityService();
  });

  describe('getAirQuality', () => {
    it('should return air quality data for given location', async () => {
      AirQualityRepository.prototype.create = jest.fn();

      jest
        .spyOn(IQAirService.prototype, 'getAirQuality')
        .mockResolvedValue({
          city: "Olawa",
          ts: "2023-02-20T15:00:00.000Z",
          aqius: 21,
          mainus: "p2",
          aqicn: 7,
          maincn: "p2",
        });

      const result = await airQualityService.getAirQuality(
        47.76,
        33.36
      );

      expect(result).toEqual(pollutionResponse);
    });
  });

  describe('getMostPolluted', () => {
    it('should return most polluted city time', async () => {
      jest
        .spyOn(AirQualityRepository.prototype, 'getMostPolluted')
        .mockResolvedValue(new Date());

      const result = await airQualityService.getMostPolluted('Olawa');

      expect(result).toEqual(mostPollutionResponse);
    });
  });
});
