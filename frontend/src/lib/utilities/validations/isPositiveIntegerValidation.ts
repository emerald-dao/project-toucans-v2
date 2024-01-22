export const isPositiveInteger = (int: string) => {
    var intRegex = /^\d+$/;
    return intRegex.test(int);
}