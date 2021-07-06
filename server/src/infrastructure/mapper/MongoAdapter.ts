import { Db, MongoClient } from 'mongodb';
import { Logger } from '../../utils/Logger';


const logger = Logger.getInstance();

class MongoAdapter {

  private static _instance: MongoAdapter;

  public db: Db;

  private constructor(uri: string, dbName: string) {
    const client = new MongoClient(uri);

    client.connect((err) => {
      if (err) throw err;

      this.db = client.db(dbName);
      logger.logInfo('MongoDB connected');
    });
  }

  public static build(uri: string, dbName: string) {
    if (this._instance) throw new Error('MongoAdapter instance already built!');

    return new MongoAdapter(uri, dbName);
  }

  public static getInstance(): MongoAdapter {
    return this._instance;
  }

}


export {
  MongoAdapter,
};
