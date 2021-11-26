# pc网易云

## 前言

> 2021年5月24日
>
> 暂停跟进课程了，angular上手有点难
>
> 最新心态不是很好，准备离职
>
> 可以说angualr是公司要求，但是对于我这个菜鸡上手有点难
>
> 以后再更近。angular真的是前端工程师功底哦 😕
>
> #branch 4-14
>
> https://github.com/lycHub/ng-wyy

- angular-cli@8.3.0
- ng-zorro-antd@8.1.2
- [api](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [ng2020+](https://live.ngplus.world/index)



- 忽略单元测试

```
ng new ng-wyy --style=less --routing -S
```

- ng-zorro-antd@8.1.2

```
Add icon assets  --- YES
Set up custom theme -- YES
Choose your local code: -- zh_CN
Choose tamplate to create projet: -- blank
```

- 修改全局注册样式文件 style.less  ===> /assets/styles/index.less 

- 安装minireset.css

`npm i minireset.css`



- 模块化设计

  - module    app/core        ng核心模块
  - module    app/pages     页面module
  - module    app/share      共享module
  - module    app/services  服务module

  需要搞懂模块化的设计 

  组件放在了pages和share 有些部分你需要exports导出



- 搭建布局

- 生成一个首页模块

  - `ng g m pages/home --routing`
  - 然后再page.module.ts导入 homeModule
  - 所以page.module.ts的shareModule可以放在HomeModule了。 本身可以不需要shareModule
  - 但是呢 homeModule需要被page.module.ts导出 
  - home-routing.modules可以引入路由组件了
    - `ng g c pages/home`
  - app-routing.modules.ts也可以引入路由 这是路由爸爸文件

- 生成一个首页模块的services模块

  - `ng g s services/home`

  - home.service.ts的provideIn是root ，对应的是app,因此作出对应的是services模块 可以将home.service.ts修改

    ```ts
    import { Injectable } from '@angular/core';
    import { ServicesModule } from './services.module';
    
    @Injectable({
      providedIn: ServicesModule
    })
    export class HomeService {
    
      constructor() { }
    }
    ```

  - 接受api请求返回的数据类型 可以用上Observable<Banner[]>

  - 需要自己定义 Banner[] 返回什么

  - 新建一个目录services/data-type  

    services/data-type/common.type.ts

    ```ts
    export type Banner = {
      targetId: number;
      url: string;
      imageUrl: string;
    }
    ```

  - home.service.ts

    ```ts
    import { Injectable } from '@angular/core';
    import { Observable } from 'rxjs';
    import { ServicesModule } from './services.module';
    import { HttpClient } from '@angular/common/http';
    import { Banner } from './data-type/common.type';
    import { map } from 'rxjs/internal/operators';
    
    @Injectable({
      providedIn: ServicesModule
    })
    export class HomeService {
    
      constructor(private http: HttpClient) { }  
    
      // 留意Observable<Banner[]>  和管道符pipe  解决any问题了
      getBanners(): Observable<Banner[]> {
        return this.http.get('http://localhost:3000/banner')
          .pipe(map( (res: { banners: Banner[]}) => res.banners))
      }
    }
    
    ```

- 生成一个pages/home module下的 组件模块
  `ng g c pages/home/components/wy-carousel`





changeDetection: ChangeDetectionStrategy.OnPush 变更检测





- 在share module下建立一个 ui目录 模块 ----共用组件

  `ng g m share/wy-ui`

  当然需要在share.module.ts引入 WyUiModule 模块

- 在wy-ui目录 创建一个专辑组件
  `ng g c share/wy-ui/single-sheet`

- 新建管道符模块
  `ng g p share/play-count`

  对应在使用管道功能的 module需要 declarations和exports

- ng的http模块也有 new HttpParams({fromString:})

- 生成一个首页模块的组件

  `ng g c pages/home/components/member-card`





### 路由与导航

- resovle 预先获取组件数据

  如果在使用真实api，很有可能数据返回有延迟，导致无法及时显示，在这种情况下如何处理呢？ 显示一个空的组件不是最好额用户体验。

  > https://v8.angular.cn/guide/router#resolve-pre-fetching-component-data

- 解决：

  - 在对应目录下

  - 比如home/components/home-resolve.service.ts

  - 这样可以不用写请求函数接口了

  - ```ts
    // home-resolve.service.ts
    import { Injectable } from "@angular/core";
    import { Resolve } from "@angular/router";
    import { forkJoin, Observable } from "rxjs";
    import { first, take } from "rxjs/internal/operators";
    import { Banner, HotTag, Singer, SongSheet } from "src/app/services/data-type/common.type";
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
    ```

  - home-routing.module.ts 需要引入该文件

    ```TS
    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';
    import { HomeResolverService } from './components/home-resolve.service'; // here
    import { HomeComponent } from './home.component';
    
    
    const routes: Routes = [
      { path: 'home', component: HomeComponent, data: { title: '发现'}, resolve: { homeDatas: HomeResolverService } } // HERE
    ];
    
    @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule],
      providers: [HomeResolverService]
    })
    export class HomeRoutingModule { }
    
    
    ```

  - home.component.ts

    ```ts
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-type/common.type';
    
    import { NzCarouselComponent } from 'ng-zorro-antd';
    import { ActivatedRoute } from '@angular/router';  // here
    import { map } from 'rxjs/internal/operators';
    
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
        private route: ActivatedRoute // 注册
      ) {
          // here  this.route.data 
          this.route.data.pipe(map (res => res.homeDatas)).subscribe(([banners, tags, sheets, singers]) => { // 结构复制
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
    
    }
    
    ```

    在angualr取数据 在resolve是最好的



### 底部音乐播放器模块

`ng g m share/wy-ui/wy-player`

然后生成一个组件
`ng g c share/wy-ui/wy-player`

引入组件的展示到页面需要流程 [不要烦恼 脑子清晰头脑清晰]

1. wy-player.module.ts 需要exports 组件
2. wy-ui.module.ts 引入 WyPlayerModule 和exports出来
3. share.module.ts 需要引入和exports --WyUimodule





### 处理歌单数据

- sheet.service.ts
- song.service.ts
- 这一版块有点复杂，需要理清p14-p15 **
- 用到rxjs操作符遍历，遍历数据 ，可以学习别人遍历



### 滑块组件模块

`ng g m share/wy-ui/my-slider`

- wy-player-module.ts引入 WysliderModule
- wy-slider.module.ts 也要exports  WySliderComponent

`ng g c share/wy-ui/wy-slider`

`ng g c share/wy-ui/wy-slider-track`

`ng g c share/wy-ui/wy-slider-handle`



注意是 视图封装模式

> https://v8.angular.cn/guide/component-styles#view-encapsulation

encapsulation： 

`None` 意味着 Angular 不使用视图封装。 Angular 会把 CSS 添加到全局样式中。而不会应用上前面讨论过的那些作用域规则、隔离和保护等。 从本质上来说，这跟把组件的样式直接放进 HTML 是一样的。(译注：能进能出。)

wy-slider.component.ts 

```ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None  // **这里决定了 wy-slider-track wy-slider-handle 的样式
})
export class WySliderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

wy-slider-track.component.ts

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class="wy-slider-handle"></div>`
})
export class WySliderHandleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
```

wy-slider-handle.component.ts

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track"></div>`
})
export class WySliderTrackComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
```





选择当前组件的ref 

可以引入 #id 名字

```ts
import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WySliderComponent implements OnInit {

  constructor(
    private el: ElementRef  // *here el ： ElementRef 元素
  ) { }

  ngOnInit() {
    console.log('el:', this.el.nativeElement);
  }

}

```





#### wy-slider组件滑动事件 pc+mobile

```
PC: mousedown mousemove mouseup
	MouseEvent
	
	event.pageX || event.pageY

phone： touchstart touchmove touchend
	TouchEvent
	
	event.touchs[0].pageX || event.touchs[0].pageY
	
position => val

position / 滑块组件总长 === (val - min) / (max - min)

ratio === (val - min) / (max- min)

ratio * (max - min) + min === val
```

#### 定义一个元素变量

`private sliderDom: HTMLDivElement;`

该内容大量的rxjs操作符---果然邪教--- 学到设计模式 P18

#### 脚手架兼容ie9

tslin.json 配置 

```
"no-non-null-assertion": false
```





### ngrx

reactive state for angular 

angular状态管理器 相当于vue的vuex react的redux。。。

> https://next.ngrx.io/ 
>
> 竟然有中文版本了

创建一个模块

`ng g m store`

不知道怎么用文字描述 只能看阅读代码了

安装

`ng add @ngrx/store`

安装调试工具

`ng add @ngrx/store-devtools`





### 项目开发配置

> https://github.com/lycHub/ng-wyy/blob/2-1/package.json



### 安装脚手架

`npm i @angular/cli -g`

查看版本号`ng --version`

```json
"dependencies": {
    "@angular/animations": "~8.2.3",
    "@angular/common": "~8.2.3",
    "@angular/compiler": "~8.2.3",
    "@angular/core": "~8.2.3",
    "@angular/forms": "~8.2.3",
    "@angular/platform-browser": "~8.2.3",
    "@angular/platform-browser-dynamic": "~8.2.3",
    "@angular/router": "~8.2.3",
    "@ngrx/store": "^8.6.1",
    "@ngrx/store-devtools": "^8.6.1",
    "minireset.css": "0.0.5",
    "ng-zorro-antd": "^8.1.2",
    "rxjs": "~6.4.0",
    "tslib": "^1.10.0",
    "zone.js": "~0.9.1"
  }
```



### 创建项目

`ng new ng-wyy --style=less --routing -S`

- 指定less样式
- --routing -S  不写单元测试

### 安装NG-ZORRO库

`ng add ng-zorro-antd@`8.1.2

为了减少麻烦，安装此版本依赖库

- add icon assets --- yes
- set up custom theme file --- yes
- choose template to create project --- blank

### angular.json有定义css引入文件路径

需要注意一下这个

### 创建一个core模块

> 用于分担`app.module.ts下的imports模块引入`

`ng g m core`

自然app.module.ts引入CoreModule就好了



===core.module.ts==

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations:[],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ServicesModule,
        PagesModule,
        ShareModule,
        AppRoutingModule
    ],
    exports: [
        ShareModule,
        AppRoutingModule
    ],
    providers:[]
})
export class CoreModule { }

```



### 创建share.module.ts

> 用途存放全局公共的组件和指令
>
> 当然需要被core.module.ts imports和exports

`ng add m share`

===share.module.ts===

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations:[],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule
    ],
    providers:[]
})
export class ShareModule { }
```



### 创建pages.module.ts

> 管理所有页面的模块

当然需要被core模块引入

`ng g m pages`

===pages.module.ts===

```ts
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [],
  imports: [
    HomeModule
  ],
  exports: [
    HomeModule
  ]
})
export class PagesModule { }
```

比如这里再创建一个home模块

`ng g m pages/home`



### 创建services.module.ts

> 创建一个服务模块，比如请求，数据交互的

最后被core模块引入，也可以被各种服务模块引用，一般做令牌和请求url设置

`ng g m services`

```ts
import { NgModule } from '@angular/core';
// 做一个令牌
export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [

  ],
  providers: [
    { provide: API_CONFIG, useValue: 'http://localhost:3000/' }
  ]
})
export class ServicesModule { }
```



### 设置core模块只能被app模块引入

> 装饰器 @SkipSelf @Optional

```ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if(parentModule) {
      throw new Error('CoreModule 只能被appModule引入');
    }
  }
}
```











