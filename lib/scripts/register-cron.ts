import { Client } from "@upstash/qstash";
import * as dotenv from "dotenv";
dotenv.config();

async function registerCronJob() {
  const qstash = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  // Schedule job to run daily at midnight
  const result = await qstash.schedules.create({
    destination: `${process.env.VERCEL_URL}/api/cron/cleanup-temp-files`,
    cron: "0 0 * * *", // Daily at midnight
  });

  console.log("Scheduled job:", result);
}

registerCronJob().catch(console.error);
