import { Db, MongoClient } from "mongodb";

declare global {
  namespace NodeJS {
    interface Global {
        mongoose: { 
        conn: {
          client: MongoClient | null;
          db: Db | null;
        }
        promise: Promise<MongoClient> | null;
      };
    }
  }
}