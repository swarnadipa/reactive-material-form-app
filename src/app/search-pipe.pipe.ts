import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(value: any, search: string): any {
    if(!search) {
      return value;
    }
    let result = value.filter(v => {
      if(!v){
        return;
      }
      return v.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    })
    return result;
  }

}
