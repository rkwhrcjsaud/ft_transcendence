FROM owasp/modsecurity-crs:4.8.0-nginx-202411071011
USER root
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y openssl\
    netcat-traditional
COPY conf/modsec.conf /etc/nginx/modsec/modsec.conf
COPY conf/default.conf /etc/nginx/conf.d/default.conf
COPY conf/proxy_params /etc/nginx/proxy_params
COPY conf/nginx.conf /etc/nginx/nginx.conf

COPY ./nginx.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/nginx.sh
CMD ["/usr/local/bin/nginx.sh"]