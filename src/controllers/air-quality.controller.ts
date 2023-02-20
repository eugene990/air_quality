import { Request, Response } from 'express';
import { AirQualityService } from '../services/air-quality/air-quality.service';
import { StatusCodes } from 'http-status-codes';
import { getAirQualityPresenter } from '../services/air-quality/get-air-quality.presenter';

export class AirQualityController {
  private airQualityService: AirQualityService;
  constructor() {
    this.airQualityService = new AirQualityService();
  }

  getAirQuality = async (req: Request, res: Response) => {
    const longitude = Number(req.query.longitude);
    const latitude = Number(req.query.latitude);

    const airQuality = await this.airQualityService.getAirQuality(longitude, latitude);

    const result = getAirQualityPresenter(airQuality);

    res.status(StatusCodes.OK).send(result);
  };

  getMostPolluted = async (req: Request, res: Response): Promise<void> => {
    const city: string = req.query.city as string;
    if (!city) {
      res.status(StatusCodes.BAD_REQUEST).send('parameter city is required');
      return;
    }

    const result = await this.airQualityService.getMostPolluted(city);

    res.status(StatusCodes.OK).send({ result });
  };
}
