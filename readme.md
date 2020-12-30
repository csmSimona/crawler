## 使用 TypeScript 编写爬虫工具



1、初始化项目

```shell
npm init -y
```

2、创建`tsconfig.json`文件，用于ts配置

```shell
tsc --init
```

3、安装`typescript`和`ts-node`（用于直接执行ts文件）

```shell
npm install -D typescript
npm install -D ts-node
```

4、安装`superagent`和`cheerio`

superagent：轻量的Ajax API 

cheerio：解析html 就像在浏览器中使用jquery一样 

```shell
npm install superagent --save
npm install cheerio --save
```

注意：ts直接引入js类库会飘红，所以需要后缀为 `.d.ts` 的翻译文件 

安装翻译文件

```shell
npm install @types/superagent -D
npm install @types/cheerio -D
```

5、最后将ts文件编译成js文件

修改文件 `package.json`

```json
"build": "tsc"

"build": "tsc -w"  // 当ts文件发生改变时，就会重新编译一次
```

`tsconfig.json` 文件

```json
"outDir": "./build" 
```

6、实现修改保存ts文件就马上编译运行

nodemon： 监控 node.js 源代码的任何变化并自动重启

concurrently：并行的运行多个命令

```shell
npm install nodemon -D
npm install concurrently -D
```

修改文件 `package.json`

```json
"scripts": {
    "dev:build": "tes -w",
    "dev:start": "nodemon node ./build/crawler.js",
    "dev": "concurrently npm:dev:*"
}
```

7、`tsconfig.json` ts配置文件 常用配置项说明

执行命令  `tsc` 会走tsconfig.json 编译根目录下的ts文件 

- 配置需要编译的文件(默认编译所有ts文件)

  ```json
  "include": ["./src/crawler.ts"]
  ```

  或

  ```json
  "files": ["./src/crawler.ts"]
  ```

- exclude：配置不需要编译的ts文件

  ```json
  "exclude": ["./src/crawler.ts"]
  ```

- removeComment：编译时移除注释

- noImplicitAny：不能有隐式的any

- outDir：输出文件

- rootDir：输入文件

- incremental：已编译的不会再编译，只编译新增的内容

- allowJs：编译js为es5语法

- checkJs：检查js语法

- noUnusedParameters：没有未使用的局部变量  报警告

