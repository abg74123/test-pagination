import {Component, OnInit} from '@angular/core';
import {ProductService} from "./core/services/product.service";
import {BehaviorSubject, Observable,Subject, shareReplay, takeUntil, tap} from "rxjs";

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
  destroy:any = new Subject()
  products:any = new BehaviorSubject([])
  products$:Observable<any> = this.products.asObservable()
  loading: boolean = true;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 10
  // key next page
  nexPageKey = {}
  // store
  productsArr:any = []

  constructor(private productService:ProductService) {
  }

  ngOnInit(){
  }

  onPageChange(event: PageEvent) {
    console.log("START onPageChange")
    console.log(event)

    this.first = event.first;
    this.rows = event.rows;

    const startSlice = this.first
    const endSlice = this.first + this.rows

    console.log("startSlice => ",startSlice)
    console.log("endSlice => ",endSlice)

    const sliceProduct = this.productsArr.slice(startSlice, endSlice)
    console.log({sliceProduct})

    console.log("productsArr => ",this.productsArr.length)
    console.log("rows => ",this.rows)

    if(sliceProduct.length < this.rows && this.productsArr.length < this.totalRecords){
      this.loading = true;
      console.log("get new product")
      this.productService.getProductList({compId:'po-1d1f72',nextPageKey:this.nexPageKey,limit:endSlice - this.productsArr.length}).pipe(
        tap(
          (res:any) => {
            this.productsArr.push(...res.data)
            this.nexPageKey = res.pagination.nexPageKey
            this.totalRecords = res.pagination.count
            this.products.next(this.productsArr.slice(startSlice, endSlice))
            this.loading = false;
          }
        ),
        takeUntil(this.destroy),
      ).subscribe()
    }else{
      console.log("!!!not get new product")
      this.products.next(sliceProduct)
    }

  }

  ngOnDestroy(): void {
    console.log("destroy component")
    this.destroy.next()
    this.destroy.complete()
  }

}
