import cron from 'node-cron';
import { processMonthlySalaries } from './salary.js';

const getLastDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

cron.schedule('59 23 * * *', async () => {
  const now = new Date();
  const today = now.getDate();
  const lastDay = getLastDayOfMonth();

  if (today === lastDay) {
    console.log('Running monthly salary processing...');
    await processMonthlySalaries();
  }
});

