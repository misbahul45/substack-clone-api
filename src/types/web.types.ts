export interface WebResponse<T = undefined> {
    success: boolean;
    status: number;
    message?: string;
    data?: T;
    error?: string;
}
