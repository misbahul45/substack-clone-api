import arcjet, { slidingWindow } from "@arcjet/node";
import "dotenv/config";

const aj = arcjet({
  key: process.env.ARJECT_API_KEY!,
  characteristics: ["ip.src"],
  rules: [
    slidingWindow({
        mode: "LIVE",
        interval: 60, 
        max: 100,
      }),
  ],
});

export default aj;
