

import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private authService: AuthService) { }

  public async handleLoginButton(): Promise<void> {
    await this.authService.login();
  }
}
