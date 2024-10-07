import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private allMoviesUrl = 'http://localhost:5205/movies'; 

  private moviesByGenreUrl = "http://localhost:5205/movies/genre";

  private favMoviesUrl = 'http://localhost:5205/cinemago/favourites';

  constructor(private http: HttpClient,private svc: AuthServiceService) { }
  token=this.svc.getToken();
  headers = { 'Authorization': `Bearer ${this.token}` }
  
  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(this.allMoviesUrl);
  }

  getMoviesByGenre(genre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.moviesByGenreUrl}/${genre}`);
  }

  getFavMovies(email:any):Observable<any>{
    return this.http.get(`http://localhost:5205/cinemago/favourites/email/${email}`,{headers:this.headers});
  }

  addToFavMovie(movie: any): Observable<any> {
    console.log(movie);
    return this.http.post(`${this.favMoviesUrl}`, movie,{headers:this.headers});
  }

  removeFavMovie(id: string, email: string): Observable<any> {
    return this.http.delete(`${this.favMoviesUrl}/${id}?email=${email}`,{headers:this.headers});
  }



  searchMovies(query: string,): Observable<any> {
    return this.http.get(`${this.allMoviesUrl}/search/${query}`);
  }
  
}
