import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatCardModule} from "@angular/material/card";
import { MatInputModule} from "@angular/material/input"
import { MatFormFieldModule} from "@angular/material/form-field"
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import {MatButtonModule} from '@angular/material/button';
import { DesignUtilityService } from '../../Services/design-utility.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,MatCardModule,MatInputModule,MatFormFieldModule,CommonModule,NgClass,RouterLink,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = { email: '', password: '', role: '' };

  constructor(private svc: AuthServiceService, private du: DesignUtilityService,private router: Router){}
  openSnackBar(message: string, action: string) {
    this.du.openSnackBar(message,action)
  }

  
  onsubmit(){
    if (this.loginForm.email && this.loginForm.password) {
       
      this.svc.login(this.loginForm).subscribe({
        next: (response) => {
          console.log(response);
          const jsonObject = JSON.parse(response.token);
          const tokenValue = jsonObject.token;
          this.svc.storeToken(tokenValue);
          this.openSnackBar(response.message,"ok");
          this.router.navigate(['home'])
        },
          error: (err) => {
            if (err.status === 401) {
              // Handle invalid login credentials
              this.openSnackBar('Invalid email or password.',"ok");
          } else {
              // Handle other errors
              this.openSnackBar('An unexpected error occurred. Please try again later.',"ok");
          }
          },
        });
      }
  }
}
