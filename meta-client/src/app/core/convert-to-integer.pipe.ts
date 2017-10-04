import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToInteger'
})
export class ConvertToIntegerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
     if (value === null || value === undefined || value === '') {
       value = 0;
     }

     return value;
  }

}
