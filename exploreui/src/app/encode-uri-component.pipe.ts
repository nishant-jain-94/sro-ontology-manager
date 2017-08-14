import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeUriComponent'
})
export class EncodeUriComponentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return encodeURIComponent(value);
  }

}
