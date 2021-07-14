import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((response) => {
        if (response.error.errorCode === 400) {
          if (response.error.messages) {
            this.toastr.error(response.error.exception)
          }
        }
        if (response.error.errorCode === 401) {
          this.authService.tryRefreshingToken();
        }
        if (response.error.errorCode === 403) {
          this.toastr.error(response.error.exception);
        }
        if (response.error.errorCode === 404) {
          this.router.navigateByUrl('/not-found');
        }
        if (response.error.errorCode === 500) {
          console.log(response.error.exception);
          this.toastr.error("Something Went Wrong")
        }
        return throwError(response.error);
      })
    );
  }
}
