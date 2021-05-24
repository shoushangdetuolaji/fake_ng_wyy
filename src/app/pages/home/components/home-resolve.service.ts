import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { first, take } from "rxjs/internal/operators";
import { Banner, HotTag, Singer, SongSheet } from "src/app/services/data-types/common.types";
import { HomeService } from "src/app/services/home.service";
import { SingerService } from "src/app/services/singer.service";
 

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];
@Injectable()

export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe: HomeService,
    private singerServe: SingerService
  ) {}
 
  resolve( ): Observable<HomeDataType> {
    // 操作符
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalSheetList(),
      this.singerServe.getEnterSinger()
    ]).pipe(first());  // 只取第一次流

  }
}