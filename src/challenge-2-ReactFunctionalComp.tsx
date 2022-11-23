import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Character from './character/Character';
import CharactersRepository from './repository/CharactersRepository';
import { Nullable } from './types/Nullable';
import { isNumber } from './utils/isNumber';

const FILTER_DEFAULT = '';
const MULTIPLIER_DEFAULT = 10;

interface RowProps {
  name: string,
  height: number | null,
  mass: number | null,
  power: number | null,
}

const Row: React.FC<RowProps> = React.memo(({ name, height, mass, power }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{isNumber(height) ? height : 'unknown'}</td>
      <td>{isNumber(mass) ? mass : 'unknown'}</td>
      <td>{isNumber(power) ? power : 'unknown'}</td>
    </tr>
  );
});

function FunctionalComp() {

  const [ characters, setCharacters ] = useState<Nullable<Character[]>>(null);
  const [ filter, setFilter ] = useState<string>(FILTER_DEFAULT);
  const [ multiplier, serMultiplier ] = useState<number>(MULTIPLIER_DEFAULT);

  // onMount
  useEffect(() => {
    if (!characters) {
      CharactersRepository.getAll().then((chars) => {
        setCharacters(chars);
      });
    }
    const listener = (event: any) => {
      if (event.key === 'Escape') {
        setFilter(FILTER_DEFAULT);
        serMultiplier(MULTIPLIER_DEFAULT);
      }
    };
    document.addEventListener('keyup', listener);
    return () => {
      document.removeEventListener('keyup', listener);
    }
  }, []);

  const onFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((e.target as HTMLInputElement).value);
  }, [setFilter]);

  const onMultiplierChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    serMultiplier(+e.target.value);
  }, [setFilter]);

  const rows = useMemo(
    () => {
      if (!characters) {
        return [];
      }
      const searchValue = filter.toLowerCase();
      return characters.filter((character) => {
          return !searchValue || character.searchString.includes(searchValue);
      }).map((character) => {
        return (
          <Row
            key={character.name}
            name={character.name}
            height={character.height}
            mass={character.mass}
            power={isNumber(character.power) ? multiplier * character.power : null}
          />
        );
      });
    },
    [characters, filter, multiplier],
  );

  return (
    <div id="functional-comp">
      <h2>React Functional Component</h2>
      Filter:
      <input
        value={filter}
        onChange={onFilterChange}
        placeholder="Filter by name"
      />
      Multiplier:{" "}
      <input
        onChange={onMultiplierChange}
        placeholder="Multiplier"
        type="number"
        min="1"
        max="20"
        value={multiplier}
      />{" "}
      Press "Escape" to reset fields
      { characters === null && (<div className="loader">Loading...</div>) }
      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {/* This is just an example, please remove */}
          {rows}
        </tbody>
      </table>
    </div>
  );
}

export default FunctionalComp;
