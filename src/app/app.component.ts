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
  totalRecords: number = this.rows
  // key next page
  nexPageKey = {}
  // store in component
  productsArr:any = []

  constructor(private productService:ProductService) {
  }

  ngOnInit(){
  }

  onPageChange(event: PageEvent) {
    console.warn("---CTRL | START FUNC onPageChange---")
    console.warn('---CTRL | EVENT---',event)

    // ^ number first start of page
    this.first = event.first;
    // ^ number rows
    this.rows = event.rows;

    const startSlice = this.first
    const endSlice = this.first + this.rows

    console.warn(`---CTRL | GET PAGE [${startSlice}] TO [${endSlice}]---`)

    // ^ slice product start to end
    const sliceProduct = this.productsArr.slice(startSlice, endSlice)

    console.warn('---CTRL | SLICE PRODUCT---',sliceProduct)

    console.warn(`---CTRL | START CHECK CONDITION---`)
    if(sliceProduct.length < this.rows && this.productsArr.length < this.totalRecords){
      console.warn(`--- ---CTRL | GET NEW PRODUCT---`)
      this.loading = true;
      // ^ get product list
      this.productService.getProductList({compId:'po-1d1f72',nextPageKey:this.nexPageKey,limit:endSlice - this.productsArr.length}).pipe(
        tap(
          (res:any) => {
            // ^ STEP1 | push product to store
            console.warn(`--- --- ---CTRL | PUSH NEW PRODCT---`)
            this.productsArr.push(...res.data)
            console.warn(`--- --- ---CTRL | NEW PRODCT---`,this.productsArr)
            // ^ STEP2 | save nexPageKey
            this.nexPageKey = res.pagination.nexPageKey
            // ^ STEP3 | save count all page
            this.totalRecords = res.pagination.count
            // ^ STEP4 | next product new [start] to [end]
            const productNew = this.productsArr.slice(startSlice, endSlice)
            console.warn(`--- --- ---CTRL | NEXT PRODUCT NEW---`,productNew)
            this.products.next(productNew)
            this.loading = false;
            console.warn("---CTRL | STOP FUNC onPageChange---")
          }
        ),
        takeUntil(this.destroy),
      ).subscribe()
    }else{
      console.warn(`--- ---CTRL | !!!NOT GET NEW PRODUCT---`)
      // ^ next product old
      this.products.next(sliceProduct)
      console.warn("---CTRL | STOP FUNC onPageChange---")
    }
  }

  ngOnDestroy(): void {
    console.log("destroy component")
    // ^ unsubscribe
    this.destroy.next()
    this.destroy.complete()
  }

}
