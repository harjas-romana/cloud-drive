import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();
const pgp = pgPromise({});

const db = pgp("postgres://harjas42:harjas@localhost:5432/cloud_drive");

export default db;