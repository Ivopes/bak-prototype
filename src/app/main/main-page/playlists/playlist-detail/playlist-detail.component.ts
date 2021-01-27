import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { DeleteDialogComponent } from 'src/app/main/shared/components/dialogs/delete-dialog/delete-dialog.component';
import { Playlist } from 'src/app/main/shared/models/playlist.model';
import { Song } from 'src/app/main/shared/models/song.model';
import { PlaylistService } from 'src/app/main/shared/services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {

  playlist: Playlist;

  /**
   * table columns to display
   */
  displayedColumns = ['select', 'name', 'remove'];

  selection: SelectionModel<Song>;

  dataSource: MatTableDataSource<Song>;

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number.parseInt(params.get('id'), 10);
        return this.playlistService.GetById(id);
      })
    ).subscribe(data => {
      this.playlist = data;
      this.dataSource = new MatTableDataSource(data.songs);
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  removeFromPl(row?: Song): void {
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res)
    ).subscribe(() => {

      // TODO: send to server
      if (!row) {
        console.log(this.selection);
        console.log(this.selection.selected);

        this.dataSource.data = this.dataSource.data.filter(s => !this.selection.selected.includes(s));
        this.selection.clear();

        return;
      }
      this.dataSource.data = this.dataSource.data.filter(s => s !== row);
    });
  }
  toPlaylists(): void {
    this.router.navigate(['/playlists']);
  }
}
