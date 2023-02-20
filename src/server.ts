import "reflect-metadata";
import dotenv from 'dotenv';
dotenv.config();
import "./db";

import { webServer } from './app';

webServer.start();
