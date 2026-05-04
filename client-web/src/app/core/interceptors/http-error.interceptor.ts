import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, attempt) => {
            // Only retry network errors (status 0), not HTTP errors (4xx/5xx)
            if (attempt === 0 && error.status === 0) {
              return timer(1000);
            }
            return throwError(() => error);
          })
        )
      ),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
