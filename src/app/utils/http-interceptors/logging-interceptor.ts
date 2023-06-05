import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoggingService } from 'src/app/services/logging/logging.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let condition: string;

    return next.handle(req).pipe(
      tap({
        next: (event) => (condition = event instanceof HttpResponse ? 'succeeded' : ''),
        // TODO: Replace Error Type with correct API Error or something like that
        error: (error: any) => {
          // Catch all http errors and pass them to our logging service
          this.loggingService.error(error);
        },
      }),
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}" ${condition} in ${elapsed} ms.`;
        this.loggingService.info(msg);
      })
    );
  }
}
