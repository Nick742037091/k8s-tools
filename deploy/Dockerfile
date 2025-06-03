# 拉取国内的nginx镜像
FROM docker.1ms.run/nginx:alpine-perl
# 暴露80端口
EXPOSE 80
# 复制构建文件到nginx http根目录
COPY ./dist /usr/share/nginx/html/FE/k8s-tools/
# 删除默认nginx配置
RUN rm /etc/nginx/conf.d/default.conf
# 复制自定义nginx配置
COPY ./deploy/nginx.conf /etc/nginx/conf.d/
