import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;
  constructor(private authService: AuthService) {}

  public async handleLogout(): Promise<void> {

    await this.authService.logout();
  }

  async ngOnInit() {
    this.user = await this.authService.getUserInfo();
  }



}
