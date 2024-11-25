FROM owasp/modsecurity-crs:4.8.0-nginx-202411071011
USER root
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y openssl

COPY ./nginx.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/nginx.sh

CMD ["/usr/local/bin/nginx.sh"]