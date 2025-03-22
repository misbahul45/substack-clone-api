import { z } from "zod";

export class Validation {
   static validate<T>(data: T, schema: z.Schema<T>): z.SafeParseReturnType<T, T> {
      return schema.safeParse(data);
   }
}
