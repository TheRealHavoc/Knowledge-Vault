import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/models/character';
import { SEEDALIGNMENT } from 'src/app/models/seed/seedAlignment';
import { SEEDSIZE } from 'src/app/models/seed/seedSize';
import { AlertService } from 'src/app/services/alert.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss']
})
export class CharacterViewComponent {
  confirmCharacterDeletionModalOpen: boolean = false;
  character: Character;

  form: FormGroup;
  initialFormValues: any;

  updatedSubscription: Subscription;

  sizeSeed = SEEDSIZE;
  alignmentSeed = SEEDALIGNMENT;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private _alertService: AlertService
  ) {
    let id: number = Number(this.route.snapshot.paramMap.get('characterid'));

    this.character = this.characterService.getCharacter(id);

    this.form = new FormGroup({
      name: new FormControl(this.character.name, [
        Validators.required
      ]),
      race: new FormControl(this.character.race),
      sex: new FormControl(this.character.sex),
      age: new FormControl(this.character.age),
      size: new FormControl(this.character.size),
      alignment: new FormControl(this.character.alignment),
      description: new FormControl(this.character.description),
      notes: new FormControl(this.character.notes),
    });

    this.initialFormValues = this.form.value;

    this.updatedSubscription = this.characterService.updated.subscribe(character => {
      this.character = character;
    })
  }

  onCharacterDeleteClick(): void {
    this.characterService.deleteCharacter(this.character);

    this.router.navigate(['campaign', Number(this.route.parent?.snapshot.paramMap.get('id')), 'characters']);

    this._alertService.success('Character deleted');
  }

  onResetToDefaultClick(): void {
    this.form.reset(this.initialFormValues);
  }

  onSaveChangesClick(): void {
    if (!this.form.valid)
      return;

    console.log(this.form.get('alignment')?.value)

    let charachter: Character = {
      id: this.character.id,
      campaignId: this.character.campaignId,
      name: this.form.get('name')?.value || '',
      race: this.form.get('race')?.value || '',
      sex: this.form.get('sex')?.value || '',
      age: this.form.get('age')?.value || '',
      size: this.form.get('size')?.value || '',
      alignment: this.form.get('alignment')?.value || '',
      description: this.form.get('description')?.value || '',
      notes: this.form.get('notes')?.value || ''
    }

    this.characterService.updateCharacter(charachter);

    this.form.markAsPristine();
    this.initialFormValues = this.form.value;

    this._alertService.success('Character updated');
  }

  ngOnDestroy(): void {
    this.updatedSubscription.unsubscribe();
  }
}
