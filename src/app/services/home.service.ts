import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient } from '@angular/common/http';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
      .pipe(map( (res: { banners: Banner[]}) => res.banners))
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot')
      .pipe(map( (res: { tags: HotTag[]}) => {
        // 按照position 排序 slice选取前5个
        return res.tags.sort((x: HotTag, y:HotTag) => {
          return x.position - y.position
        }).slice(0, 5);
      }))
  }

  getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http.get(this.uri + 'personalized')
      .pipe(map( (res: { result: SongSheet[]}) => res.result.slice(0, 16)));
  }
}
