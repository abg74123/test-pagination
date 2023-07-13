import {Component, OnInit} from '@angular/core';
import {ProductService} from "./core/services/product.service";
import {BehaviorSubject, Observable, tap} from "rxjs";

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  products = new BehaviorSubject([])
  products$:Observable<any> = this.products.asObservable()
  constructor(private product:ProductService) {
  }

  ngOnInit(){
    this.product.getProductList().pipe(tap(
      res => {
        this.products.next(res)

      }
    )).subscribe()
  }

  first: number = 0;
  rows: number = 10;

  onPageChange(event: PageEvent,nexPageKey:any) {
    console.log(event)
    this.first = event.first;
    this.rows = event.rows;

    this.product.getProductList({nextPageKey:nexPageKey,limit:event.rows}).pipe(tap(
      res => {
        this.products.next(res)
      }
    )).subscribe()
  }

}
