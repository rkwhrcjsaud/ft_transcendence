# Vault의 최신 버전을 사용하는 공식 HashiCorp Vault 이미지
FROM hashicorp/vault:latest

RUN mkdir -p /vault/config
COPY ./tools/setup.sh /
COPY ./tools/local.json /vault/config/local.json
RUN chmod +x /setup.sh

# Vault 서버 실행
ENTRYPOINT ["/setup.sh"]