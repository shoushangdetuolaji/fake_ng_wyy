import { Inject, Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Song, SongSheet, SongUrl } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) { }

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get(this.uri + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');
    return this.getSongUrl(ids)
      .pipe(
        map(urls => this.generateSongList(songArr, urls))
      );
  }
  // 拼接歌单
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find( url => url.id === song.id ).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    // console.log('generateSongList', result);
    return result;
  }
}
