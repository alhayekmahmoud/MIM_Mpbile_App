import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private loggingService: LoggingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getAccessToken$().pipe(
      mergeMap((token) => {
        let functionsKey: string;
        if (req.url.includes(environment.endpoints.vehicle)) {
          functionsKey = environment.api.vehicle;
        }
        if (req.url.includes(environment.endpoints.score)) {
          functionsKey = environment.api.score;
        }
        // TODO: Exception handling when no functions key can be added
        this.loggingService.debug(functionsKey);
        // If a functionsKey was provided we append to the header
        if (functionsKey) {
          const authReq = req.clone({
            setHeaders: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: `Bearer ${token}`,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'x-functions-key': functionsKey,
            },
          });
          return next.handle(authReq);
        }
        // Otherwise handle the normal http request
        return next.handle(req);
      }),
      catchError((error) => {
        this.loggingService.error(error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.authService.revokeLoggedInState().then(() => {
              return throwError(error);
            });
          }
        }
        return throwError(error);
      })
    );
  }
}
