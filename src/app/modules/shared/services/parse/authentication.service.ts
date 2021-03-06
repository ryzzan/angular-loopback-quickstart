import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Parse } from 'parse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    Parse.initialize('qPZfPQPQGttsCpugKLR1j6BNqlLJ1G2WTIEqKH9H', 'wKafb4TZ5Pj0Gw8BMvNyfDdGW5U8S0jaRsGvx5C7');
    Parse.serverURL = 'https://parseapi.back4app.com/';
  }

  login = (params) => new Promise((res, rej) => {
    // Set params errors: start
    if (!params) {
      res({
        code: 'l-error-01',
        message: 'Defina parâmetros mínimos'
      });
    } else {
      if (!params.user) {
        res({
          code: 'l-error-02',
          message: 'Parâmetro obrigatório: user'
        });
      }

      if (!params.password) {
        res({
          code: 'l-error-03',
          message: 'Parâmetro obrigatório: password'
        });
      }

      if (!params.loginMode) {
        res({
          code: 'l-error-04',
          message: 'Parâmetro obrigatório: loginMode'
        });
      }

      if (!params.navigateTo) {
        res({
          code: 'l-error-05',
          message: 'Parâmetro obrigatório: navigateTo'
        });
      }
    }
    // Set params errors: end
    if (params.loginMode === 'emailAndPassword') {
      Parse.User.logIn(params.user, params.password)
      .catch(pErr => {
        if (pErr) {
          this._snackbar.open(pErr['message'], '', {
            duration: 4000
          });
        }
      })
      .then(pRes => {
        if (pRes && pRes.attributes.sessionToken) {
          pRes['code'] = 'l-success-01';
          pRes['message'] = 'Bem vindo';

          this._router.navigate([params.navigateTo]);

          this._snackbar.open(pRes['message'], '', {
            duration: 4000
          });

          res(pRes);
        } else {
          res(pRes);
          if (pRes) {
            this._snackbar.open(pRes['message'], '', {
              duration: 4000
            });
          }
        }
      });
    }
  })

  logout = (params) => new Promise((res, rej) => {
    if (!params) {
      res({
        code: 'lg-error-01',
        message: 'Defina parâmetros mínimos'
      });
    } else {
      if (!params.navigateTo) {
        res({
          code: 'lg-error-02',
          message: 'Parâmetro obrigatório: navigateTo'
        });
      }

      Parse.User.logOut()
      .then(() => {
        this._router.navigate([params.navigateTo]);
        location.reload();
      });
    }
  })

  getUser = () => {
    return Parse.User.current();
  }

  handleParseError = (err, navigateTo) => {
    console.log(err);
    switch (err.code) {
      case 209:
        Parse.User.logOut();
        this._router.navigate([navigateTo]);
      break;
    }
  }
}
