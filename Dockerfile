FROM nginx:alpine
MAINTAINER Brent

RUN mkdir -p /usr/share/nginx/html/reinvent.awsevents.com/
ADD index.html reinvent.awsevents.com /usr/share/nginx/html/
