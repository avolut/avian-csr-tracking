const asyncForEach = async (
    array: Array<any>,
    callback: (a: any, b: number, c: Array<any>) => any
) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const globalVar = { asyncForEach }