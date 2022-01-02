import chalk from 'chalk';
import httpContext from 'express-http-context';
import path from 'path';
import stringify from 'fast-safe-stringify';
import winston from 'winston';

type logObject = string | Record<string, unknown> | Record<string, unknown>[] | undefined;

const Logger = (fileName: string, level = process.env.LOG_LEVEL, ...additionalParams: logObject[]): winston.Logger => {
  const initialLogs: logObject[] = [];
  if (path.parse(fileName)) {
    const pathSplitted = fileName.split('/');
    const srcIndex = pathSplitted.findIndex((part) => part === 'src');
    const projPath = pathSplitted.splice(srcIndex).join('/');
    initialLogs.push(projPath);
  }
  initialLogs.push(...additionalParams);

  const winstonLogger = winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.errors(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
  });

  const wrapper = (original: winston.LeveledLogMethod) => (...args: unknown[]) => {
    if (args.length === 0) original('');

    const logs = [
      ...initialLogs.map((iarg) => typeof iarg === 'object' ? stringify(iarg) : `${iarg}`),
    ];

    const reqId = httpContext.get('reqId');
    if (reqId) logs.push('reqId', reqId);

    for (const arg of args) {
      if (arg instanceof Error) {
        logs.push(chalk.red(arg.name));
        logs.push(chalk.red(arg.message));
        if (arg.stack) logs.push(chalk.red(arg.stack));

      } else if (typeof arg === 'object') {
        logs.push(stringify(arg));
      } else {
        logs.push(`${arg}`);
      }
    }


    return original(logs.join(' | '));
  };

  winstonLogger.error = wrapper(winstonLogger.error);
  winstonLogger.warn = wrapper(winstonLogger.warn);
  winstonLogger.info = wrapper(winstonLogger.info);
  winstonLogger.verbose = wrapper(winstonLogger.verbose);
  winstonLogger.debug = wrapper(winstonLogger.debug);
  winstonLogger.silly = wrapper(winstonLogger.silly);

  return winstonLogger;
}

export default Logger;