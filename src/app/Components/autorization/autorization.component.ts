import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Interfaces/user';
import { AutorizationService } from '../../Services/autorization.service';
import { StorageService } from '../../Services/storage.service';

@Component({
  selector: 'app-autorization',
  templateUrl: './autorization.component.html',
  styleUrls: ['./autorization.component.scss']
})
export class AutorizationComponent implements OnInit {
  users?:User[]
  userForm:FormGroup
  constructor (
    private formBuilder:FormBuilder,
    private httpAutorizationService:AutorizationService,
    private router:Router,
    private storageService:StorageService
  )
  {
    const controls = {
      login:[null, [Validators.required, Validators.pattern("[A-Za-zА-Яа-яЁё]*")]],
      password:[null, [Validators.required, Validators.pattern("[A-Za-zА-Яа-яЁё]*")]]
    }
    this.userForm = this.formBuilder.group(controls)
  }
ngOnInit(): void {
  this.getData();
}
getData():void {
  this.httpAutorizationService.getUsers().subscribe({
    next: (users: User[]) => {
    this.users = users;
    },
    error: (e) => console.error(e),
    complete: () => console.info(`Я нашёл юзеров ${this.users}`)
    })

}
postUser():void {
  const user:User = this.userForm.value;
  if((user.login!=null)&&(user.password!=null)&&(user.login!="")&&(user.password!="")) {
  console.log(user);
  this.httpAutorizationService.postUser(user).subscribe({
    error:(e)=>console.error(e),
    complete:()=>{
      this.storageService.saveLogin(user.login);
      this.storageService.savePassword(user.password);
      this.router.navigate(["list"])
    }
  })

}
}
tryLogIn():void {
  this.storageService.saveLogin(this.userForm.value.login);
  this.storageService.savePassword(this.userForm.value.password); 
  this.router.navigate(["list"])

  // if ((this.storageService.getLogin()!=null)&&(this.storageService.getPassword()!=null)
  // &&(this.storageService.getLogin()!="")&&(this.storageService.getPassword()!="")) {
  // this.users.forEach(user => {
  //   if((user.password)==(this.storageService.getPassword())&&(user.login)==(this.storageService.getLogin()))
  //   {
  //     this.router.navigate(["list"])
  //   }
  // });
  // }
  // else {
  //   alert("Wrong password or login")
  // }
}
}
