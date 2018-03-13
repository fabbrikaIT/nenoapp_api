import * as mongo from "mongodb";

export class MongoDbConnection {
  private url = process.env.MONGO_URI || "";
  private host = process.env.MONGO_HOST;
  private port = process.env.MONGO_PORT;
  //private dbName = process.env.DB_NAME;

  private client;

  constructor() {
    
  }

  public Connect = (dbName: string, callback) => {
    console.log("iniciando conexão com o banco");

    mongo.connect(this.url).then((database, err) => {
        if (err) {
            console.log(err); //Retornar exceção
            this.client = null;

            callback(null);
        } else {
            this.client = database;

            callback(this.client.db(dbName));
        }
    });
  }

  public Close = () => {
    console.log("Finalizando conexão com banco de dados");

      this.client.close();
      this.client = null;
  }
}
