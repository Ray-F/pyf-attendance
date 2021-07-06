class Logger {

  private static _instance: Logger;

  private prefix = '[Server] ';

  private constructor() {
  }

  logInfo(message: string) {
    console.log(this.prefix + message);
  }

  logWarn(message: string) {
    console.warn(this.prefix + message);
  }

  logError(message?: string) {
    console.error(this.prefix + (message || 'An unknown error occurred'));
  }

  /**
   * Gets the current logger instance.
   */
  public static getInstance(): Logger {
    if (this._instance) return this._instance;

    this._instance = new this();

    return this._instance;
  }
}


export {
  Logger,
};
