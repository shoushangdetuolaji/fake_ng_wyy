import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-type/common.type';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { NzCarouselComponent } from 'ng-zorro-antd';

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
    private homeServe: HomeService,
    private SingerServe: SingerService
  ) {
      this.getBanners();
      this.getHotTags();
      this.getPersonalizedSheetList();
      this.getEnterSingers();
   }
  
  private getBanners() {
    this.homeServe.getBanners().subscribe(banners => {
      this.banners = banners;
      console.log(this.banners);
    })
  }

  private getHotTags() {
    this.homeServe.getHotTags().subscribe(tags => {
      this.hotTags = tags;
    })
  }

  private getPersonalizedSheetList() {
    this.homeServe.getPersonalSheetList().subscribe(sheets => {
      this.songSheetList = sheets;
    })
  }

  private getEnterSingers() {
    this.SingerServe.getEnterSinger().subscribe(singers => {
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

}
