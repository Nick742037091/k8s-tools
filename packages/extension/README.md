# k8s tools

蓝月亮前端项目快速配置 k8s 的插件

![alt text](https://mh-aliyun-oss.bluemoon.com.cn//mh-scrm-admin/XeB5YEfdhN.png)

## 操作入口

1. 文件编辑页面右上角点击插件图标

![alt text](https://mh-aliyun-oss.bluemoon.com.cn//mh-scrm-admin/KfX7ANMHBp.png)

2. 文件编辑页面右键点击菜单

![alt text](https://mh-aliyun-oss.bluemoon.com.cn//mh-scrm-admin/34j3tkpyG5.png)

## 操作说明

1. k8s token 需要从 k8s 站点登录后提取

![alt text](https://mh-aliyun-oss.bluemoon.com.cn//mh-scrm-admin/4CwcQYnJme.png)

2. 选择对应的环境（测试/生产）

3. 会自动从项目的 package.json 的`name`字段中获取项目名称，可自行调整

4. 会自动提取项目中 `origin` 远程仓库的 git 地址，可自行调整

5. 选择环境自动回自动添加对应的构建分支（测试-test / 生产-main），可自行调整

## 操作结果

![alt text](https://mh-aliyun-oss.bluemoon.com.cn//mh-scrm-admin/Jinjwm3Ct2.png)

点击确定之后，会自动创建 k8s 项目和流水线，并在项目中添加部署文件，按照操作步骤提交文件，部署成功之后就可以访问页面链接。
