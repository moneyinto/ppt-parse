## pptx解析工具

```js
const PPT2JsonSdk = require("ppt-parse");
const sdk = new PPT2JsonSdk();
const pptPath = ""; // ppt所在路径
const outputPath = ""; // 资源文件输出路径
const parse = async () => {
    const result = await sdk.parse(pptPath, outputPath);
    console.log(result); // 解析的PPT的json数据
    return result;
}
```

[【参考】djwxfdt 的 ppt-parse](https://github.com/djwxfdt/ppt-parse)

【注】由于原先的版本不支持node 12以上版本 重新修改升级支持node 14版本，并且解析的数据格式不是我想要的，重新进行了整理