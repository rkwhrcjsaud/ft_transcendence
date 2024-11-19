# Vault의 최신 버전을 사용하는 공식 HashiCorp Vault 이미지
FROM hashicorp/vault:latest

COPY ./tools/setup.sh /setup.sh
RUN chmod +x /setup.sh

# Vault 서버 실행
ENTRYPOINT ["/setup.sh"]