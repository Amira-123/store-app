import { Injectable } from '@angular/core';
import { Product } from '../utilis/Product';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getAllProducts() {
    return this.http.get<Product[]>(environment.baseApi);
  }
}
