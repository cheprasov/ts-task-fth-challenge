// Note: The HTML for this challenge can be found in index.html

import Character from './character/Character';
import CharactersRepository from './repository/CharactersRepository';
import { Nullable } from './types/Nullable';
import { isNumber } from './utils/isNumber';

const MULTIPLIER_DEFAULT = 10;

interface DomRow {
  tr: HTMLTableRowElement,
  tdName: HTMLTableCellElement,
  tdPower: HTMLTableCellElement,
  character: Character,
}

const getMultipliedPowerLabel = (power: Nullable<number>, multiplier: number): string => {
  if (!isNumber(power)) {
    return 'unknown';
  }
  return `${power * multiplier}`;
}

const createRow = (character: Character): DomRow => {
  const tr = document.createElement('tr');
  const tdName = createColumn(character.name);
  tr.appendChild(tdName);
  tr.appendChild(createColumn(character.height?.toString() || 'unknown'));
  tr.appendChild(createColumn(character.mass?.toString() || 'unknown'));
  const tdPower = createColumn(getMultipliedPowerLabel(character.power, MULTIPLIER_DEFAULT));
  tr.appendChild(tdPower);

  return {
    tr,
    tdName,
    tdPower,
    character,
  };
}

const createColumn = (value: string): HTMLTableCellElement => {
  const td = document.createElement('td');
  td.appendChild(document.createTextNode(value));
  return td;
}

const filterRows = (domRows: DomRow[], filter: string) => {
  domRows.forEach((row) => {
    row.tr.hidden = !!filter && !row.character.searchString.includes(filter);
    //TODO: Update power on showing previously hidden row
  })
};

const updatePower = (domRows: DomRow[], multiplier: number) => {
  domRows.forEach((row) => {
    // TODO: Update power only for visile characters
    const newPower = getMultipliedPowerLabel(row.character.power, multiplier);
    if (row.tdPower.innerText !== newPower) {
      row.tdPower.innerText = newPower;
    };
  })
};

const tbody = document.getElementById('tbody')!;
tbody.hidden = true;

// Note: this function is run inside of src/main.tsx
export async function runVanillaApp() {
  // Start here

  const characters = await CharactersRepository.getAll();
  const domRows = characters.map(c => createRow(c));
  domRows.forEach(row => {
    tbody.appendChild(row.tr);
  });

  document.getElementById('filter')!.addEventListener('keyup', (event: any) => {
    filterRows(domRows, event.target.value.toLocaleLowerCase());
  });

  document.getElementById('multiplier')!.addEventListener('change', (event: any) => {
    updatePower(domRows, +event.target.value);
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      (document.getElementById('filter')! as HTMLInputElement).value = '';
      filterRows(domRows, '');
      (document.getElementById('multiplier')! as HTMLInputElement).value = MULTIPLIER_DEFAULT.toString();
      updatePower(domRows, MULTIPLIER_DEFAULT);
    }
  });

  document.getElementById('loader')!.hidden = true;
  tbody.hidden = false;
}
