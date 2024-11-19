#!/bin/sh

# Vault 서버를 백그라운드에서 시작
vault server -config=/vault/config/local.json &

# Vault 서버가 시작될 시간을 기다림
sleep 5

# 초기화 여부 확인 후, Vault 초기화 수행
if [ ! -f /vault/data/initialized ]; then
    # 초기화 수행 및 결과 저장
    vault operator init -key-shares=1 -key-threshold=1 > /vault/file/init-output.txt

    # 토큰과 언실 키를 별도 파일로 저장
    grep 'Unseal Key 1:' /vault/file/init-output.txt | awk '{print $NF}' > /vault/file/unseal_key.txt
    grep 'Initial Root Token:' /vault/file/init-output.txt | awk '{print $NF}' > /vault/file/root_token.txt

    # 초기화 완료 플래그 파일 생성
    touch /vault/data/initialized
fi

# Vault 언실
vault operator unseal $(cat /vault/file/unseal_key.txt)

# 포그라운드에서 Vault 실행
wait
