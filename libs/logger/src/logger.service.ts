import { LoggerService as LoggerSrv, LogLevel } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Logger } from 'pino';

const nrPino = require('@newrelic/pino-enricher')
const pino = require('pino')
const logger = pino(nrPino())

@Injectable()
export class LoggerService implements LoggerSrv {
  private readonly logger: Logger;

  constructor() {
    this.logger = logger;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  verbose?(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
