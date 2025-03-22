import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";

export class AppError extends Error {
  status: number;
  code?: string;
  errors?: { path: string; message: string }[];

  constructor(message: string, status: number = 500, errors?: { path: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`);

  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || "Internal Server Error";
  const errors = err instanceof AppError ? err.errors : undefined;

  if (!(err instanceof AppError)) {
    console.error(err);
  }

  res.status(status).json({ 
    success: false, 
    status, 
    message, 
    errors 
  });

  next(); 
};


export const middleware404=(req:Request, res:Response)=>{
    res.status(404).json({ success: false, message: "Route Not Found", status: 404 });
}