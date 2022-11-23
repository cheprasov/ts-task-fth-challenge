import React, { Component } from "react";
import Character from './character/Character';
import CharactersRepository from './repository/CharactersRepository';
import { Nullable } from './types/Nullable';
import { isNumber } from './utils/isNumber';

const FILTER_DEFAULT = '';
const MULTIPLIER_DEFAULT = 10;

interface ClassCompState {
  filter: string,
  multiplier: number,
  characters: Nullable<Character[]>,
};

interface RowProps {
  name: string,
  height: number | null,
  mass: number | null,
  power: number | null,
}

class Row extends Component<RowProps> {

  shouldComponentUpdate(nextProps: Readonly<RowProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return nextProps.power !== this.props.power;
  }

  render () {
    const { name, height, mass, power } = this.props;
    return (
      <tr>
        <td>{name}</td>
        <td>{isNumber(height) ? height : 'unknown'}</td>
        <td>{isNumber(mass) ? mass : 'unknown'}</td>
        <td>{isNumber(power) ? power : 'unknown'}</td>
      </tr>
    );
  };
};

class ClassComp extends Component<{}, ClassCompState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      filter: FILTER_DEFAULT,
      multiplier: MULTIPLIER_DEFAULT,
      characters: null,
    };
  }

  listener = (event: any) => {
    if (event.key === 'Escape') {
      this.setState({
        filter: FILTER_DEFAULT,
        multiplier: MULTIPLIER_DEFAULT,
      });
    }
  };

  componentDidMount() {
    document.addEventListener('keyup', this.listener);
    CharactersRepository.getAll().then((chars) => {
      this.setState({characters: chars});
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.listener);
  }

  onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ filter: (e.target as HTMLInputElement).value });
  };

  onMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ multiplier: +e.target.value });
  };

  getRows() {
    const { characters, filter, multiplier } = this.state;
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
  }

  render() {
    return (
      <div id="class-comp">
        <h2>React Class Component</h2>
        Filter:
        <input
          onChange={this.onFilterChange}
          placeholder="Filter by name"
          value={this.state.filter}
        />
        Multiplier:{" "}
        <input
          onChange={this.onMultiplierChange}
          placeholder="Multiplier"
          type="number"
          min="1"
          max="20"
          value={this.state.multiplier}
        />{" "}
        Press "Escape" to reset fields
        { this.state.characters === null && (<div className="loader">Loading...</div>) }
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
            {this.getRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ClassComp;
