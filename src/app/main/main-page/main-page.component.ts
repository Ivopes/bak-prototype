import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DbxJson } from '../shared/models/dbxJson.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  openSideNav = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.readJwtCode();
  }
  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
  private readJwtCode(): void {
    this.route.queryParamMap
    .pipe(
      switchMap(params => {
        const code = params.get('code');
        return code != null ? this.authService.dropboxOAuth(code) : EMPTY;
      }))
      .pipe(
        switchMap(data => {
          const token = data.access_token;
          const id = data.account_id;
          console.log(data);

          localStorage.setItem('jwt-dropbox', token);
          const dbxJson: DbxJson = {
            cursor: '',
            dropboxId: data.account_id,
            jwtToken: token
          };
          return this.authService.saveDropboxJwt(dbxJson);
        })
      )
      .subscribe(() => {
      });
  }
}
