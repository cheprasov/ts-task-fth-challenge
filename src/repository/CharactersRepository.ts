import Character from '../character/Character';
import CharacterFactory from '../character/CharacterFactory';
import { Nullable } from '../types/Nullable';
import { replaceVars } from '../utils/replaceVars';
import { CharacterDTO } from './CharacterDTO';

const URL = 'https://swapi.dev/api/people/?page={:page:}&format=json'
const STORAGE_KEY = 'characters';

export default class CharactersRepository {

    private static _promiseAllCharacters: Promise<Character[]> | null = null;

    // todo: Refactor + check errors
    static getAll(): Promise<Character[]> {
        if (this._promiseAllCharacters) {
            return this._promiseAllCharacters;
        }
        this._promiseAllCharacters = new Promise(async (resolve) => {
            let items: Nullable<CharacterDTO[]> = null;
            try {
                const cache = localStorage.getItem(STORAGE_KEY);
                if (cache) {
                    items = JSON.parse(cache);
                }
            } catch (e) {
                // error
                console.log(e);
            }

            if (!items) {
                const page1 = await fetch(replaceVars(URL, { page: 1 })).then(r => r.json());
                const pagesPromises: Promise<any>[] = [page1];
                const pageCount = Math.ceil(page1.count / (page1.results.length || 1));
                for (let i = 2; i <= pageCount; i += 1) {
                    pagesPromises.push(fetch(replaceVars(URL, { page: i })).then(r => r.json()));
                }

                const data = await Promise.all(pagesPromises);
                items = data.reduce((res, page) => {
                    res.push(...page.results);
                    return res;
                }, []);

                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                } catch (e) {
                    // error
                    console.log(e);
                }
            }
            // todo: check for duplicates
            const characters = items!.map((dto: CharacterDTO) => CharacterFactory.create(dto));
            resolve(characters);
        });
        return this._promiseAllCharacters;
    }

}