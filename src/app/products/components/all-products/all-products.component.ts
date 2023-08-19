import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import {
  Observable,
  concatMap,
  debounceTime,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Product } from '../../utilis/Product';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  searchInput: FormControl<string | null> = this.fb.control(null);

  filteredProducts: Product[] = [];

  // allProducts: Product[] = [];
  // allProducts$: Observable<Product[]> = this.productService.getAllProducts()
  //allProducts$: Product[] = [];

  ngOnInit(): void {
    // this.getAllProducts();
    // console.log(this.allProducts$);
    this.searchInput.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((value: string | null) =>
          from(
            this.router.navigate([], {
              queryParams: {
                search: value || null,
              },
              queryParamsHandling: 'merge',
            })
          )
        )
      )
      .subscribe();

    this.onParamsChange();
    console.log(this.filteredProducts);
  }

  private onParamsChange(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params: ParamMap) => {
          return this.productService.getAllProducts().pipe(
            tap((prods: Product[]) => {
              this.search(params.get('search'), prods);
            })
          );
        })
      )
      .subscribe();
  }

  // getAllProducts() {
  //   this.productService.getAllProducts().subscribe({
  //     next: (res) => {
  //       this.allProducts = res;
  //       this.filteredProducts = res;
  //     },
  //   });
  // }

  search(searchValue: string | null, allProducts: Product[]): void {
    this.searchInput.patchValue(searchValue);

    const newArray = allProducts.filter((prod: Product) =>
      (prod.title as string)
        .toLowerCase()
        .includes((searchValue as string)?.toLowerCase())
    );

    if (searchValue) {
      this.filteredProducts = newArray;
      console.log(this.filteredProducts);
    } else {
      this.filteredProducts = allProducts;
      console.log(this.filteredProducts);
    }
  }

  clearInput() {
    // this.router.navigate([]);
    this.searchInput.patchValue(null);
  }
}
