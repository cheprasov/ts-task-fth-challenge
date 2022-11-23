import { isNumber } from './isNumber';

export const parseNumber = (value: string | undefined): number | null => {
    if (typeof value === 'undefined') {
        return null;
    }
    const num = parseInt(value, 10);

    return isNumber(num) ? num : null;
}