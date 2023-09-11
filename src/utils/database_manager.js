import OracleDB from "oracledb";
import pool from "./connection_pool";

// Initialize the pool once.
pool.start();

export default async function runQuery(query, commit, binds = {}) {
    const connection = await pool.acquire();
    try {
        const result = await connection.execute(query, binds, { outFormat: OracleDB.OUT_FORMAT_OBJECT });
        await connection.commit();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        pool.release(connection);
    }
}
