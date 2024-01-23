import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Interfaces/user';
import { AuthorizationService } from '../../Services/authorization.service';
import { StorageService } from '../../Services/storage.service';
import { AUTHCONTROLS } from '../../constants';

@Component({
  selector: 'app-autorization',
  templateUrl: './autorization.component.html',
  styleUrls: ['./autorization.component.scss'],
})
export class AutorizationComponent {
  userForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private httpAutorizationService: AuthorizationService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.userForm = this.formBuilder.group(AUTHCONTROLS);
  }

  postUser(): void {
    const user: User = this.userForm.value;
    if (
      user.login != null &&
      user.password != null &&
      user.login != '' &&
      user.password != ''
    ) {
      this.httpAutorizationService.postUser(user).subscribe({
        error: (e) => console.error(e),
        complete: () => {
          this.storageService.saveLogin(user.login);
          this.storageService.savePassword(user.password);
          this.storageService.setAuth();
          this.router.navigate(['list']);
        },
      });
    }
  }
  tryLogIn(): void {
    this.storageService.saveLogin(this.userForm.value.login);
    this.storageService.savePassword(this.userForm.value.password);
    this.router.navigate(['list']);
  }
}
