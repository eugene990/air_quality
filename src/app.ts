import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import helmet from 'helmet';

const { NODE_PORT } = process.env;
const PORT = NODE_PORT ? Number.parseInt(NODE_PORT) : 8080;

import { WebServer } from "./web-server";
import { AirQualityController } from "./controllers/air-quality.controller";
import { asyncErrorMiddleware } from "./middlewares/async-error.middleware";

const webServer = new WebServer({ defaultPort: PORT });

webServer.configure((app) => {
  app.use(helmet({ contentSecurityPolicy: false })); // This is an API, hence CSP is not necessary here
  app.use(cors());

  // Assets
  // if (process.env.NODE_ENV !== 'production') {
  //   app.use('/api/docs', express.static(path.join(__dirname, '../docs')));
  // }

  app.get("/", (req, res) => {
    res.json({ 
      name: "Air quality API"
     });
  });

  app.get('/api/_status', (request, response) => {
    if (! webServer.isReady) {
      return response.status(StatusCodes.SERVICE_UNAVAILABLE).json({});
    }
    return response.status(StatusCodes.OK).json({
      ok: webServer.isReady
    });
  });

  const airQualityConttoller = new AirQualityController();

  app.get('/v1/nearest-city-pollution',  asyncErrorMiddleware(airQualityConttoller.getAirQuality));
  app.get('/v1/most-polluted', asyncErrorMiddleware(airQualityConttoller.getMostPolluted));
});

export { webServer };
