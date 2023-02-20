
import AppDataSource from "./data-source";

export const connectToDatabase = (): Promise<void> => {
  return AppDataSource.initialize()
    .then(() => {
      console.info(`Successfully connected to database`);
    })
    .catch((err) => {
      console.error('An error occurred while connecting to database', err);
      throw new Error("DB connection error")
    });
};
  
connectToDatabase();
