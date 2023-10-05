import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

interface TGetProductList{
  compId:string,
  limit?:number,
  nextPageKey?:any
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProductList(p?: TGetProductList): Observable<any> {

    let url = `https://xleftpcawg.execute-api.ap-southeast-1.amazonaws.com/beta/product/test/list?compId=${p?.compId}`

    if (p && p.limit) {
      console.log("limit => ",p.limit);
      url += `&limit=${p.limit}`
    }
    if (p && p.nextPageKey && !this.isEmpty(p.nextPageKey)) {
      console.log("nextPageKey => ",p.nextPageKey);
      url += `&key_0=${encodeURIComponent(p.nextPageKey.PK)}&key_1=${encodeURIComponent(p.nextPageKey.SK)}&key_2=${encodeURIComponent(p.nextPageKey.GSI6PK)}&key_3=${encodeURIComponent(p.nextPageKey.GSI6SK)}`
    }

    console.log({url})

    return this.http.get(url)
  }

  isEmpty(obj:any) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

}
