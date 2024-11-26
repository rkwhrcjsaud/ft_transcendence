#!/bin/sh
# Vault 서버를 백그라운드에서 시작
vault server -config=/vault-data/local.json &

sleep 3

# 초기화 여부 확인 후, Vault 초기화 수행
if [ ! -f /vault-data/initialized ]; then
    # 초기화 수행 및 결과 저장
    vault operator init -key-shares=1 -key-threshold=1 > /vault-data/init-output.txt
    # 토큰과 언실 키를 별도 파일로 저장
    grep 'Unseal Key 1:' /vault-data/init-output.txt | awk '{print $NF}' > /vault-data/unseal_key.txt
    grep 'Initial Root Token:' /vault-data/init-output.txt | awk '{print $NF}' > /vault-data/root_token.txt

    # 초기화 완료 플래그 파일 생성
    touch /vault-data/initialized

    # Vault 언실
fi
vault operator unseal $(cat /vault-data/unseal_key.txt)

sh /secret.sh
wait