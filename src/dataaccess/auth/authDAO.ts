import { UserEntity } from './../../models/auth/user.model';
import { BaseDAO } from '../baseDAO';
import { DataAccessResult } from '../dataAccess.result';
import { MongoDbConnection } from '../../config/mongoDbConnection';

export class AuthDAO {

    private connDb = new MongoDbConnection();
    
    /**
     * Login
     */
    public Login = (email: string, password: string, callback)  => {
        // this.connDb.Connect(
        //     connection => {
        //         const query: string = 'SELECT * FROM OWNER WHERE EMAIL = ? AND PASSWORD = ?';

        //         connection.query(query, [email, password], (error, results) => {
        //             callback(results, error);
        //         });
        //     }, 
        //     error => {
        //         callback(null, error);
        //     }
        // );
    }

    // Create a new user
    public Insert = (user: UserEntity, callback) => {
        this.connDb.Connect(process.env.MONGO_NAME || "", (dbc) => {
          if (dbc) {
            let collection = dbc.collection(process.env.MONGO_SCHOOL_NAME);
    
            if (collection) {
              let c = collection.count(
                { email: user.email },
                { limit: 1 },
                function(err, count) {
                  if (count > 0) {
                    callback("User already exists", null);
                  } else {
                    collection.insert(user, { w: 1 }, function(err, result) {
                      callback(err, result);
                    });
                  }
                }
              );
            }
          }
        });
      }

      public ListUsers = (callback) => {
        this.connDb.Connect(process.env.MONGO_NAME || "", (dbc) => {
            if (dbc) {
              let collection = dbc.collection(process.env.MONGO_SCHOOL_NAME);
      
              if (collection) {
                  console.log(collection);
      
                  collection.find().toArray((err, docs) => {
                      console.log(docs.length);
                      console.log(err);
      
                      if (docs.length > 0) {
                          callback(null, docs);
                      } else {
                          callback("User not found", null);
                      }
                  });
              } else {
                callback(null);
              }
            } else {
              callback(null);
            }
      
            this.connDb.Close();
          });
      } 

      public GetUser = (username: string, password: string, callback) => {
        this.connDb.Connect(process.env.MONGO_NAME || "", (dbc) => {
          if (dbc) {
            let collection = dbc.collection(process.env.MONGO_SCHOOL_NAME);
    
            if (collection) {
                collection.find({email: username, password: password}, {limit: 1}).toArray((err, docs) => {
                    console.log(docs.length);
    
                    if (docs.length > 0) {
                        callback(null, docs[0]);
                    } else {
                        callback("User not found", null);
                    }
                });
            } else {
              callback(null);
            }
          } else {
            callback(null);
          }
    
          this.connDb.Close();
        });
      }
}