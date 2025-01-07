#!/bin/sh
# Vault 서버를 백그라운드에서 시작
vault server -config=/local.json &

# Vault 서버가 시작될 때까지 대기
until nc -z localhost 8200; do
    sleep 1
done
sleep 3

# 초기화 여부 확인 및 초기화 수행
if [ ! -f /vault-data/initialized ]; then
    vault operator init -key-shares=1 -key-threshold=1 > /vault-data/init-output.txt
    # /vault-data/init-output.txt이 생성되었는지 확인
    sleep 3
    # 생성되었으면 다음 명령어로 넘어가고, 그렇지 않으면 sleep 루프를 돌며 대기
    until [ -f /vault-data/init-output.txt ]; do
        sleep 1
    done
    grep 'Unseal Key 1:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_UNSEAL_KEY
    grep 'Initial Root Token:' /vault-data/init-output.txt | awk '{print $NF}' > $VAULT_ROOT_TOKEN
    touch /vault-data/initialized && rm -rf /vault-data/init-output.txt
fi

# 언실 수행
vault operator unseal $(cat $VAULT_UNSEAL_KEY) && vault login $(cat $VAULT_ROOT_TOKEN)

# KV 엔진 확인 및 생성, AppRole 발급
if ! vault secrets list | grep -q '^transcendence/'; then
    vault secrets enable -path=transcendence kv
    vault auth enable approle
    sh backrole.sh && sh frontrole.sh
fi
python3 secret.py

# Vault 서버 프로세스 대기
wait