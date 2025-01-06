#!/bin/sh
# Vault 서버를 백그라운드에서 시작
vault server -config=/local.json &

# Vault 서버가 시작될 때까지 대기
until nc -z localhost 8200; do
    sleep 1
done

# 초기화 여부 확인 및 초기화 수행
if [ ! -f /vault-data/initialized ]; then
    vault operator init -key-shares=1 -key-threshold=1 > /vault-data/init-output.txt
    sleep 1
    # 초기화 성공 여부 확인
    while true; do
        if grep -q 'Unseal Key 1:' /vault-data/init-output.txt && grep -q 'Initial Root Token:' /vault-data/init-output.txt; then
            break
        fi
        sleep 1
    done
    grep 'Unseal Key 1:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_UNSEAL_KEY
    grep 'Initial Root Token:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_ROOT_TOKEN
    touch /vault-data/initialized
    rm -rf /vault-data/init-output.txt

    # 언실 수행
    vault operator unseal $(cat $VAULT_UNSEAL_KEY)

    # Vault 로그인
    vault login $(cat $VAULT_ROOT_TOKEN)

    # 엔진 생성
    vault secrets enable -path=transcendence kv

    # AppRole 생성 스크립트 실행
    vault auth enable approle
    sh backrole.sh && sh frontrole.sh
fi

# 언실 수행
vault operator unseal $(cat $VAULT_UNSEAL_KEY)
# Vault 로그인
vault login $(cat $VAULT_ROOT_TOKEN)

python3 /secret.py

# Vault 서버 프로세스 대기
wait