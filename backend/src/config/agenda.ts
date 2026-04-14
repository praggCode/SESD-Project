import Agenda from 'agenda';
import { env } from './env';
import logger from '../shared/utils/logger';

const agenda = new Agenda({
  db: {
    address: env.MONGODB_URI,
    collection: 'agendaJobs',
  },
  processEvery: '30 seconds',
});

agenda.on('ready', () => {
  logger.info('Agenda scheduler ready');
});

agenda.on('error', (error) => {
  logger.error(`Agenda error: ${error}`);
});

export default agenda;