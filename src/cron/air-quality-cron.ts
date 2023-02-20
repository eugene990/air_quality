import * as cron from 'node-cron';
import { connectToDatabase } from '../db';
import { AirQualityService } from '../services/air-quality/air-quality.service';

const airQualityService = new AirQualityService();

connectToDatabase().then(() => {
  console.info('connected to DB');
});

const job = cron.schedule('* * * * *', async () => {
  try {
    console.info('task is running');

    await airQualityService.getAirQuality(2.352222, 48.856613);
  } catch (err) {
    console.error('Cron task Error: ', err);
  }
});

job.start();
console.info('Job starts');