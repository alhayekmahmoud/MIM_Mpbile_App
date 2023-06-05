/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MimLogLevel } from './logging.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private logLevel: MimLogLevel;

  constructor() {
    this.logLevel = environment.config.logging.level as MimLogLevel;
  }

  public log(...data: unknown[]): void {
    if (this.logLevel === MimLogLevel.all) {
      console.log('MimLoggingServive - ', ...data);
    }
  }

  public info(...data: unknown[]): void {
    if (this.logLevel === MimLogLevel.info || this.logLevel === MimLogLevel.all) {
      console.info('MimLoggingServive - ', ...data);
    }
  }

  public debug(...data: unknown[]): void {
    if (this.logLevel === MimLogLevel.debug || this.logLevel === MimLogLevel.all) {
      console.debug('MimLoggingServive - ', ...data);
    }
  }

  public warn(...data: unknown[]): void {
    if (this.logLevel === MimLogLevel.warn || this.logLevel === MimLogLevel.all) {
      console.warn('MimLoggingServive - ', ...data);
    }
  }

  public error(...data: unknown[]): void {
    if (this.logLevel === MimLogLevel.error || this.logLevel === MimLogLevel.all) {
      console.error('MimLoggingServive - ', ...data);
    }
  }
}
