import { Injectable } from '@angular/core';

@Injectable()
export class DetailsViewModel {
  entityType: string;
  entityId: string;
  entityName: string;
  entityDescription: string;
  groups: {name: string, entities: Array<DetailsViewModel>}[];
}
