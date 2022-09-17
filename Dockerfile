FROM nginx:alpine

WORKDIR /var/www/html

COPY ./miniFacebook/dist/mini-facebook .

COPY ./nginx.conf /etc/nginx/conf.d/default.conf