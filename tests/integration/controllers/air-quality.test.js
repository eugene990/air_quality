"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const air_quality_controller_1 = require("../../../src/controllers/air-quality.controller");
const air_quality_service_1 = require("../../../src/services/air-quality/air-quality.service");
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
    let req;
    let res;
    let airQualityController;
    let airQualityService;
    beforeEach(() => {
        req = {};
        res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        airQualityController = new air_quality_controller_1.AirQualityController();
        airQualityService = new air_quality_service_1.AirQualityService();
    });
    describe('getAirQuality', () => {
        const queryParams = {
            latitude: '37.7749',
            longitude: '-122.4194',
        };
        it('should return pollution data for nearest city', () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(air_quality_service_1.AirQualityService.prototype, 'getAirQuality')
                .mockResolvedValue(pollutionResponse);
            req.query = queryParams;
            yield airQualityController.getAirQuality(req, res);
            expect(airQualityService.getAirQuality).toHaveBeenCalledWith(+queryParams.longitude, +queryParams.latitude);
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
        }));
    });
    describe('getMostPolluted', () => {
        it('should return 200 and pollution data', () => __awaiter(void 0, void 0, void 0, function* () {
            const city = 'Olawa';
            jest
                .spyOn(air_quality_service_1.AirQualityService.prototype, 'getMostPolluted')
                .mockResolvedValue(mostPollutionResponse);
            req.query = { city };
            yield airQualityController.getMostPolluted(req, res);
            expect(airQualityService.getMostPolluted).toHaveBeenCalledWith(city);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                result: mostPollutionResponse,
            });
        }));
        it('should return 400 if city not provided in query', () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(air_quality_service_1.AirQualityService.prototype, 'getMostPolluted')
                .mockResolvedValue(mostPollutionResponse);
            req.query = {};
            yield airQualityController.getMostPolluted(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('parameter city is required');
        }));
    });
});
