import pino from 'pino';
import pinoPretty from 'pino-pretty';
import dayjs from 'dayjs';

const stream = pinoPretty({
  translateTime: true,
  ignore: 'pid',
  singleLine: true,
});

const log = pino(
  {
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  stream
);

export default log;
