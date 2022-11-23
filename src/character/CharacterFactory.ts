import { CharacterDTO } from '../repository/CharacterDTO';
import Character from './Character';

export default class CharacterFactory {

    static create(characterDto: CharacterDTO): Character {
        return new Character(characterDto);
    }

}