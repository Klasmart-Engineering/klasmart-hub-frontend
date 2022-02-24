FROM nginx:alpine

ENV NGINX_PORT 80
ENV NGINX_HOST localhost

# https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-28928
RUN apk --no-cache upgrade musl

COPY ./dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/templates/default.conf.template