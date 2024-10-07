import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt'
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  
 
  constructor(private http: HttpClient, private router: Router) { }
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());  // BehaviorSubject to track login status

  token=this.getToken();
  headers = { 'Authorization': `Bearer ${this.token}` }
  authStatus$ = this.authStatus.asObservable();  // Observable for components to subscribe to


  UserRegistration(userobj: any): Observable<any> {
    return this.http.post(`http://localhost:5205/auth/user`, userobj);
  }

  login(loginobj: any): Observable<any> {
    return this.http.post(`http://localhost:5205/auth/login`, loginobj);
  }
 
  GetName(email : any):Observable<any>{
    return this.http.get(`http://localhost:5205/User/GetUserById?email=${email}`);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token',tokenValue);
    this.decodedToken();
    this.authStatus.next(true);
  }
  storeEmail(email: string) {
    localStorage.setItem('useremail',email);
  }

  getEmail()  {
    return localStorage.getItem('useremail') ?? '';
  }
  
  getToken(){
    return localStorage.getItem('token');
  }

  signOut(){
    localStorage.clear();
    this.authStatus.next(false);  // Update auth status on sign out
    this.router.navigate(['login']);
  }
  isLoggedIn(): boolean{
    if(localStorage.getItem('token')== null){
    return false;}
    else{
      return true;
    }
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    const decodedToken=jwtHelper.decodeToken(token);
    const email = this.getEmailFromDecodedToken(decodedToken);
    console.log(email);
    return jwtHelper.decodeToken(token)
  }

  getEmailFromDecodedToken(decodedToken: any): string | null {
    const emailClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
    if (decodedToken[emailClaim]) {
      localStorage.setItem('useremail',decodedToken[emailClaim]);
      return decodedToken[emailClaim];
      
    }
    return null; 
  }
}
