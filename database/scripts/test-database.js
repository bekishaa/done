import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Load environment variables from .env.local first, then fallback to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error(
      "[db:test] DATABASE_URL is not set. Add it to your .env/.env.local before running this command."
    );
    process.exitCode = 1;
    return;
  }

  console.log("[db:test] Using DATABASE_URL:", dbUrl);

  let connection;

  try {
    // Parse the MySQL connection string
    const url = new URL(dbUrl);

    if (url.protocol !== "mysql:") {
      throw new Error(
        `Expected mysql protocol in DATABASE_URL, got "${url.protocol}".`
      );
    }

    const host = url.hostname || "localhost";
    const port = Number(url.port || 3306);
    const user = decodeURIComponent(url.username || "");
    const password = decodeURIComponent(url.password || "");
    const database = (url.pathname || "").replace(/^\//, "");

    console.log("[db:test] Connecting with config:", {
      host,
      port,
      user,
      database,
    });

    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });

    console.log("[db:test] Attempting to run SELECT 1 ...");
    const [rows] = await connection.query("SELECT 1 AS result");
    console.log("[db:test] ✅ Connection successful! Result:", rows);
  } catch (error) {
    console.error("[db:test] ❌ Connection failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end().catch(() => undefined);
    }
  }
}

main().catch((error) => {
  console.error("[db:test] Unexpected error:", error);
  process.exitCode = 1;
});

