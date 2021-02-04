import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { PlaylistService } from '../shared/services/playlist.service';
import { SongService } from '../shared/services/song.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SnackBarService } from '../shared/services/snackBar.service';
import { LoadingService } from '../shared/services/loading.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  openSideNav = false;
  showMain = true;

  isSmallScreen;

  constructor(
    private router: Router,
    private songService: SongService,
    private playlistService: PlaylistService,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService
    ) { }

  ngOnInit(): void {
    this.redirectCheck();

    this.isSmallScreen = this.breakpointObserver.observe(Breakpoints.XSmall);
  }
  /**
   * delete token from storage and and redirect user to login
   */
  logout(): void {
    localStorage.removeItem('jwt');
    this.songService.clearData();
    this.playlistService.clearData();
    this.router.navigate(['/login']);
  }
  /**
   * redirect to playlists if needed
   */
  private redirectCheck(): void {
    if (this.router.url === '/') {
      this.showMain = true;
      this.router.navigate(['/playlists']);
    }
  }
  toMain(): void {
    this.router.navigate(['/']);
  }
  getLoading(): Observable<boolean> {
    return this.loadingService.loading;
  }
}
