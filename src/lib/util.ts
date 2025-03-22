import bcrypt from "bcrypt";
export function datediff(first: Date, second: Date): number {
    return (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
}


export const hashedPassword = async(password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const isMatchedPassword = async(password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}