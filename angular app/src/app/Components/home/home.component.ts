import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  banners = [
  
    { imageUrl: 'http://surl.li/fviktx' },
    { imageUrl: 'http://surl.li/tadrbf'  },
    { imageUrl: 'http://surl.li/ghzjyw'},
    { imageUrl: 'http://surl.li/azyiqv' }
  ];
   constructor(private svc: AuthServiceService,private router: Router){}
  
    // Function to handle Sign In button click
     onSignIn(): void {
      console.log('Sign In button clicked');
      // Redirect to the login page or trigger login modal
    }
  
    // Function to handle Get Started button click (if needed)

    onGetStarted() {
      const temp = this.svc.getToken();
      if(temp==null){
        this.router.navigate(['login'])
      }
      else{
        this.router.navigate(['movies'])
      }
    }
  
}
