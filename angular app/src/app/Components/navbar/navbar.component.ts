import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,MatIconModule,MatToolbar,MatMenuModule,MatButtonModule,MatButtonModule,RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  name:string='';
  isLoggedIn = false;
    constructor(private svc: AuthServiceService){}
    email:string = this.svc.getEmail();
    isMobile: boolean = false;
    ngOnInit() {
      this.checkScreenSize();
      // Subscribe to auth status observable from the AuthService
      this.svc.authStatus$.subscribe(status => {
        this.isLoggedIn = status; // Update navbar status
        if (this.isLoggedIn) {
          this.email = this.svc.getEmail(); // Fetch the user email when logged in
          this.svc.GetName(this.email).subscribe({
            next: (response) => {
              this.name=response.name;
            },
              error: (err) => {
                console.log("error in getting movies");
              },
            });
        }
      });
    }
    @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 600;
  }
   signout(){
    this.svc.signOut();
   }

}


