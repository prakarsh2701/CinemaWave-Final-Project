import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule} from "@angular/material/card";
import { MatInputModule} from "@angular/material/input"
import { MatFormFieldModule} from "@angular/material/form-field"
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import {MatButtonModule} from '@angular/material/button';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule,MatCardModule,MatInputModule,MatFormFieldModule,CommonModule,ReactiveFormsModule,RouterLink,MatButtonModule, MatBottomSheetModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  
  user={name:'',email:'', password:'',confirmPassword:''};
  private _snackBar = inject(MatSnackBar);
  constructor(private svc: AuthServiceService,private router: Router){}
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      duration:2000,
      horizontalPosition:'right',
      verticalPosition:'top'
    });
  }

  
  onUserRegistration(){
    if (this.user.email && this.user.password && this.user.name) {
      const loginData = {
        email: this.user.email,
        UserName:this.user.name,
        password: this.user.password
      };
      this.svc.UserRegistration(loginData).subscribe({ next: (response : any) => {
        console.log('Response from backend:', response);
        this.openSnackBar(response.message,"ok");
        this.router.navigate(['login'])
      },
      error: (err: any) => {
        if (err.status === 409) {
          // Handle user already exists case
          this.openSnackBar(`User already exists:, ${err.error.message}`,"ok");
      } else {
          // Handle other errors
          this.openSnackBar(`An error occurred:', ${err}`,"ok");
      }
      },
      }
      );
    }
  }
}
