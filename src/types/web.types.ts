
export interface WebResponse<T = undefined> {
    success: boolean;
    status: number;
    message?: string;
    data?: T;
    error?: string;
}


export type Result<T, E = unknown> = Success<T> | Failure<E>;

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E = unknown> = {
  data: null;
  error: E;
};