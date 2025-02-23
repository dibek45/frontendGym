import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys',
  standalone: true
})
export class ObjectKeysPipe implements PipeTransform {
  transform(value: any): string[] {
    return value ? Object.keys(value) : [];
  }
}
