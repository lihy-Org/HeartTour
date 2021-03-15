FROM nginx:1.19.8-perl
MAINTAINER 475760135@qq.com
COPY . /xzladmin
RUN cd /xzladmin && curl -sL https://deb.nodesource.com/setup_14.x | bash - \ 
                 && apt-get install -y nodejs \
                 && npm i yarn -g \
                 && yarn config set registry https://registry.npm.taobao.org/ \
                 && yarn \
                 && yarn build \
                 && mv /xzladmin/dist/ /app/ \
                 && rm -r /xzladmin
WORKDIR /app
copy conf/nginx.conf /etc/nginx/nginx.conf 
copy conf/default /etc/nginx/sites-enabled/default
#Nginx logs to Docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
	ln -sf /dev/stderr /var/log/nginx/error.log 
EXPOSE 80 443