import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private srvc : HttpClient, private svc: AuthServiceService) { }
  private favMoviesUrl = 'http://localhost:5205/cinemago/favourites';
  token=this.svc.getToken();
  headers = { 'Authorization': `Bearer ${this.token}` }

  getMoviebyEmail(email:any):Observable<any>{
    return this.srvc.get(`http://localhost:5205/cinemago/favourites/email/${email}`,{headers:this.headers});
  }

  deletePackage(id: string, email: string): Observable<any> {
    return this.srvc.delete(`${this.favMoviesUrl}/${id}?email=${email}`,{headers:this.headers});
  }
}
