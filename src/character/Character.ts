import { CharacterDTO } from '../repository/CharacterDTO';
import { Nullable } from '../types/Nullable';
import { calculatePower } from '../utils/calculatePower';
import { parseNumber } from '../utils/parseNumber';

export default class Character {

     // The name of this person.
    public readonly name: string;

     // The height of the person in centimeters.
    public readonly height: Nullable<number>;

    // The mass of the person in kilograms.
    public readonly mass: Nullable<number>;

    // The power of the person in kilograms.
    public readonly power: Nullable<number>;

    // The name of this person.
    public readonly searchString: string;

    constructor({ name, height, mass }: CharacterDTO) {
        this.name = name;
        this.height = parseNumber(height);
        this.mass = parseNumber(mass);
        this.power = calculatePower(this.height, this.mass);
        this.searchString = this.name.toLocaleLowerCase();
    }

}