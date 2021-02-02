import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  api_url = environment.api_url;
  constructor(private http: HttpClient) { }

  addBooks(data:any){
    return this.http.post(this.api_url + `/books`, data);
  }
  updatebookinfo(data:any, id:any){
    return this.http.put(this.api_url + `/books/${id}`, data);
  }
  delete(id:any){
    return this.http.delete(this.api_url + `/books/${id}`, id);
  }
  getBooksInfo(){
    return this.http.get(this.api_url + `/books`);
  }
  getBookInfo(id:any){
    return this.http.get(this.api_url + `/books/${id}`, id);
  }
}
