import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.types';

import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex, SetPlayList, SetSongList } from 'src/app/store/actions/player.actions';
import {HomeService} from '../../services/home.service';
import {SingerService} from '../../services/singer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];


  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private store$: Store<AppStoreModule>
  ) {
      this.route.data.pipe(map (res => res.homeDatas)).subscribe(([banners, tags, sheets, singers]) => { // 结构赋值
        this.banners = banners;
        this.hotTags = tags;
        this.songSheetList = sheets;
        this.singers = singers;
      });
   }

  ngOnInit() {

  }

  onBeforeChange( {to} ) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    // ng-zotto文档 轮播图实例的方法
    // console.log(this.nzCarousel);
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      console.log('res :', list);
      this.store$.dispatch(SetSongList({ songList: list }));
      this.store$.dispatch(SetPlayList({ playList: list }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
    });
  }
}
