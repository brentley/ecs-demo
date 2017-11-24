FROM nginx:alpine
MAINTAINER Brent

RUN mkdir -p /usr/share/nginx/html/js
RUN mkdir -p /usr/share/nginx/html/days_until_re_invent_files
ADD index.html party.gif /usr/share/nginx/html/
ADD js/jquery-3.1.1.js /usr/share/nginx/html/js/
ADD days_until_re_invent_files /usr/share/nginx/html/days_until_re_invent_files
