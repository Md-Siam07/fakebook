import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user.model';
import { ToastrService } from 'ngx-toastr';

import { UserService } from 'src/app/shared/user-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  isTeacher : boolean = false;
  selectedUser = new User();
  passwordMismatch : boolean = false;
  cPassword: string = "";

  response = {
    userId: '',
    email: ''
  }

  constructor(private toastr: ToastrService,private userService: UserService, private router: Router) { }
  serverErrorMessages: string = "";

  ngOnInit(): void {
    if(localStorage.getItem('loginStatus') == 'true'){
      this.router.navigateByUrl('dashboard');
    }
  }
  userType() : boolean {
    return this.isTeacher;
  }


  signUp(){
    this.passwordMismatch = false;
    if(this.selectedUser.password!= this.cPassword){
        this.passwordMismatch = true;
        return;
    }

    this.userService.postUser(this.selectedUser).subscribe(
      (res:any) => {
        this.response = res['data'];
        this.toastr.success('Registration Complete')
        //this.userService.setResponse(this.response.userId, this.response.email);
        this.router.navigateByUrl('dashboard');
      },
      (err:any) => {
        if(err.status == 422){
          this.serverErrorMessages = err.error.join('<br>');
        }
        else{
          this.serverErrorMessages = "Something went wrong";
        }
      }
    )
  }

  resetForm(){
    this.selectedUser.fullName = "";
    this.selectedUser.email = "";
    this.selectedUser.password = "";
    this.cPassword = "";
    this.serverErrorMessages = "";
  }

  hasAccount(){
    console.log('loginn clicked')
    this.router.navigateByUrl('login');
  }
}
