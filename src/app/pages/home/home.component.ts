import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-type/common.type';

import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service'

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


  @ViewChild(NzCarouselComponent, {static:true}) private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService
  ) {
      this.route.data.pipe(map (res => res.homeDatas)).subscribe(([banners, tags, sheets, singers]) => { // 结构赋值
        this.banners = banners;
        this.hotTags = tags;
        this.songSheetList = sheets;
        this.singers = singers;
      })
   }

  
  ngOnInit() {
  }

  onBeforeChange( {to} ) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    console.log('id :', id);
    this.sheetServe.playSheet(id).subscribe(res => {
      console.log('res :', res);
    });
  }
}
