小技巧：
- 导入插件 imports:['vue'] 并修改 tsconfig.app.json的includes，配置auto-imports.d.ts文件
- tailwindcss单位转换 @theme{--spacing:1px;}
- eslint校验放宽{name:'custom/lint',rulers:{'xxx':'off'}}
- scss自动隐式导入函数变量 vite.config.ts配置项 css:{
    preprocessorOptions:{
      scss:{
        additionalData: "@use '@/styles/functions.scss' as *;",
      }
    }
  }
- select-none是tailwindCSS让元素不可选中的类

误解：
- & 不是“选择子元素”，而是当前父选择器 表示同一个元素同时拥有两个类