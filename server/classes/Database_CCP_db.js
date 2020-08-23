// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_CCP_db";
import UserModel from "../models/CCP_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.CCP_db.host +
        ":" +
        properties.CCP_db.port +
        "//" +
        properties.CCP_db.user +
        "@" +
        properties.CCP_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.CCP_db.name,
      properties.CCP_db.user,
      properties.CCP_db.password,
      {
        host: properties.CCP_db.host,
        dialect: properties.CCP_db.dialect,
        port: properties.CCP_db.port,
        logging: false
      }
    );
    this.dbConnection_CCP_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_CCP_db;
  }
}

export default new Database();
