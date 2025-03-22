export function datediff(first: Date, second: Date): number {
    return (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
}
