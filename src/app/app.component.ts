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
  products$:Observable<any> = this.products.asObservable().pipe(shareReplay(1))
  loading: boolean = false;
  first: number = 0;
  rows: number = 10;

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

    if(!!sliceProduct.length){
      console.log("!!!not get new product")
      this.products.next(sliceProduct)
    }else{
    this.loading = true;
      console.log("get new product")
      this.productService.getProductList({compId:'po-1d1f72',nextPageKey:this.nexPageKey,limit:endSlice - this.productsArr.length}).pipe(
        tap(
        (res:any) => {
          this.productsArr.push(...res.data)
          this.nexPageKey = res.pagination.nexPageKey
          this.products.next(this.productsArr.slice(startSlice, endSlice))
          this.loading = false;
        }
      ),
        takeUntil(this.destroy),
      ).subscribe()
    }

  }

  ngOnDestroy(): void {
    console.log("destroy component")
    this.destroy.next()
    this.destroy.complete()
  }

}
