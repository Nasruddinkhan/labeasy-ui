import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { guest, Token, User } from './interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(guest);

  constructor(private http: HttpClient, private token: TokenService) {
    this.token
      .change()
      .pipe(
        switchMap(() => iif(() => this.check(), this.http.get<User>('/me'), of(guest))),
        map(user => Object.assign({}, guest, user))
      )
      .subscribe(user => this.user$.next(user));
  }

  check() {
    console.log("check");
    return this.token.valid();
  }

  login(email: string, password: string, rememberMe = false) {
    console.log(email);
    console.log(password);
    console.log(rememberMe);
    return this.http
      .post<Token>('/auth/login', { email, password, remember_me: rememberMe })
      .pipe(
        tap(token => this.token.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.http.post('/auth/logout', {}).pipe(
      tap(() => this.token.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }
}
