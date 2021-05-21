# pc网易云

- angular-cli@8.3.0
- ng-zorro-antd@8.1.2
- [api](https://github.com/Binaryify/NeteaseCloudMusicApi)



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