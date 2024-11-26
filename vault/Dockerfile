# Vault의 최신 버전을 사용하는 공식 HashiCorp Vault 이미지
FROM hashicorp/vault:latest

COPY ./tools/setup.sh /
COPY ./tools/secret.sh /
RUN chmod +x /setup.sh
RUN chmod +x /secret.sh

# Vault 서버 실행
ENTRYPOINT ["/setup.sh"]