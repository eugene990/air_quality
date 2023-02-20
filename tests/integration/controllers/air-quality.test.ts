import { Request, Response } from 'express';
import { AirQualityController } from '../../../src/controllers/air-quality.controller';
import { AirQualityService } from '../../../src/services/air-quality/air-quality.service';

jest.mock('../../../src/repositories/air-quality.repository');

const pollutionResponse = {
  city: "Olawa",
  ts: "2023-02-20T15:00:00.000Z",
  aqius: 21,
  mainus: "p2",
  aqicn: 7,
  maincn: "p2",
};

const mostPollutionResponse = `Olawa was the most polluted on Mon Feb 20 2023}`;

describe('AirQualityController', () => {
  let req: Request;
  let res: Response;
  let airQualityController: AirQualityController;
  let airQualityService: AirQualityService;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    airQualityController = new AirQualityController();
    airQualityService = new AirQualityService();
  });

  describe('getAirQuality', () => {
    const queryParams = {
      latitude: '37.7749',
      longitude: '-122.4194',
    };

    it('should return pollution data for nearest city', async () => {
      jest
        .spyOn(AirQualityService.prototype, 'getAirQuality')
        .mockResolvedValue(pollutionResponse);
      req.query = queryParams;

      await airQualityController.getAirQuality(req, res);

      expect(airQualityService.getAirQuality).toHaveBeenCalledWith(
        +queryParams.longitude,
        +queryParams.latitude,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        Result: {
          Pollution: {
            ts: "2023-02-20T15:00:00.000Z",
            aqius: 21,
            mainus: "p2",
            aqicn: 7,
            maincn: "p2",
          },
        },
      });
    });
  });

  describe('getMostPolluted', () => {
    it('should return 200 and pollution data', async () => {
      const city = 'Olawa';
      jest
        .spyOn(AirQualityService.prototype, 'getMostPolluted')
        .mockResolvedValue(mostPollutionResponse);
      req.query = { city };

      await airQualityController.getMostPolluted(req, res);

      expect(airQualityService.getMostPolluted).toHaveBeenCalledWith(city);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        result: mostPollutionResponse,
      });
    });

    it('should return 400 if city not provided in query', async () => {
      jest
        .spyOn(AirQualityService.prototype, 'getMostPolluted')
        .mockResolvedValue(mostPollutionResponse);
      req.query = {};

      await airQualityController.getMostPolluted(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('parameter city is required');
    });
  });
});
