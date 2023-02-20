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
const air_quality_repository_1 = require("../../../src/repositories/air-quality.repository");
const air_quality_service_1 = require("../../../src/services/air-quality/air-quality.service");
const iqair_service_1 = require("../../../src/services/iqair/iqair.service");
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
    let airQualityService;
    beforeEach(() => {
        airQualityService = new air_quality_service_1.AirQualityService();
    });
    describe('getAirQuality', () => {
        it('should return air quality data for given location', () => __awaiter(void 0, void 0, void 0, function* () {
            air_quality_repository_1.AirQualityRepository.prototype.create = jest.fn();
            jest
                .spyOn(iqair_service_1.IQAirService.prototype, 'getAirQuality')
                .mockResolvedValue({
                city: "Olawa",
                ts: "2023-02-20T15:00:00.000Z",
                aqius: 21,
                mainus: "p2",
                aqicn: 7,
                maincn: "p2",
            });
            const result = yield airQualityService.getAirQuality(47.76, 33.36);
            expect(result).toEqual(pollutionResponse);
        }));
    });
    describe('getMostPolluted', () => {
        it('should return most polluted city time', () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(air_quality_repository_1.AirQualityRepository.prototype, 'getMostPolluted')
                .mockResolvedValue(new Date());
            const result = yield airQualityService.getMostPolluted('Olawa');
            expect(result).toEqual(mostPollutionResponse);
        }));
    });
});
