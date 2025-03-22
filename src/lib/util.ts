import bcrypt from "bcrypt";
import { Result } from "../types/web.types";
export function datediff(first: Date, second: Date): number {
    return (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
}


export const hashedPassword = async(password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const isMatchedPassword = async(password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}


export const tryCatch = async <T, E = unknown>(
    promise: Promise<T>
  ): Promise<Result<T, E>> => {
    try {
      return { data: await promise, error: null };
    } catch (error) {
      return { data: null, error: error as E };
    }
  };