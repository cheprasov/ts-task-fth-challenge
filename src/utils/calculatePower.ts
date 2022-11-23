import { Nullable } from '../types/Nullable';
import { isNumber } from './isNumber';

export const calculatePower = (height: Nullable<number>, mass: Nullable<number>): Nullable<number> => {
    if (!isNumber(height) || !isNumber(mass)) {
        return null;
    }
    return height * mass;
}