# pc网易云

- angular-cli@8.3.0
- ng-zorro-antd@8.1.2



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

