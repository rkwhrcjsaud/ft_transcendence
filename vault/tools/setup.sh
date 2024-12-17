#!/bin/sh
# Vault 서버를 백그라운드에서 시작
vault server -config=/local.json &

sleep 3

# 초기화 여부 확인 후, Vault 초기화 수행
if [ ! -f /vault-data/initialized ]; then
    # 초기화 수행 및 결과 저장
    vault operator init -key-shares=1 -key-threshold=1 > /vault-data/init-output.txt
    # 토큰과 언실 키를 별도 파일로 저장
    grep 'Unseal Key 1:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_UNSEAL_KEY
    grep 'Initial Root Token:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_ROOT_TOKEN

    # 초기화 완료 플래그 파일 생성
    touch /vault-data/initialized

    # 기존 초기화 파일 삭제
    rm -rf /vault-data/init-output.txt
fi
# Vault 언실
vault operator unseal $(cat $VAULT_UNSEAL_KEY)
# Vault에 로그인
vault login $(cat $VAULT_ROOT_TOKEN)
# KV 엔진이 없는 경우 생성
vault secrets list | grep -q '^transcendence/' || vault secrets enable -path=transcendence kv

# AppRole 설정
vault auth enable approle
sh backrole.sh
sh frontrole.sh

python3 /secret.py
wait