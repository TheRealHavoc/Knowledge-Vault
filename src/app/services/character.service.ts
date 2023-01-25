import { Injectable } from '@angular/core';
import { Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly _key: string = 'characters';

  characters: Character[] = [];

  constructor() { }

  private all(): Character[] {
    let data = JSON.parse(localStorage.getItem(this._key) || "{}");

    if (Array.isArray(data))
      this.characters = data;

    return this.characters;
  }

  getCharacters(): Character[] {
    return this.all();
  }

  getCampaignCharacters(campaignId: number): Character[] {
    return this.all().filter(character => character.campaignId === campaignId);
  }

  addCharacter(charachter: Character): Character {
    this.characters.push(charachter);

    localStorage.setItem(this._key, JSON.stringify(this.characters));

    return charachter;
  }

  getNextID(): number {
    if (this.characters.length === 0)
      return 1;

    return (Math.max(...this.characters.map(o => o.id)) + 1);
  }
}