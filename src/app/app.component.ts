import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private loggedInSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    // Wait until the capacitor platform is ready before performing any app related things
    this.platform.ready().then(async () => {
      // Call the auth service setup method to check if an access token is still available
      await this.authService.setup();

      // Subscribe to the auth service loggedIn flag and either navigate the user to the home page or the login page
      this.loggedInSubscription = this.authService.isLoggedIn.pipe(
        map((state) => {
          if (state) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/login']);
          }
        })
      ).subscribe();
    });
  }

  ngOnDestroy(): void {
    // Never forget to unsubscribe ;)
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
  }
}
