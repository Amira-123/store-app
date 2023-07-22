import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { Observable, debounceTime, filter, map, tap } from 'rxjs';
import { Product } from '../../utilis/Product';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}
  searchInput: FormControl<string | null> = this.fb.control(null);
  value: string | null = '';
  // allProducts$: Observable<Product[]> = this.productService.getAllProducts();
  allProducts$: Product[] = [];
  filteredProducts: Product[] = [];
  ngOnInit(): void {
    this.getAllProducts();
    console.log(this.allProducts$);
    this.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.value = val;
          console.log(this.value);
          this.search();
        })
      )
      .subscribe();
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts$ = res;
        this.filteredProducts = res;
      },
    });
  }
  search() {
    let newArray = this.allProducts$.filter((el: any) =>
      el.title.toLowerCase().includes(this.value?.toLowerCase())
    );
    if (this.value) {
      this.filteredProducts = newArray;
    } else {
      this.filteredProducts = this.allProducts$;
    }
  }
}
