#!/bin/sh
# 백엔드용 정책 생성
vault policy write backend-policy - <<EOF
path "transcendence/data/back/*" {
    capabilities = ["read"]
}

path "transcendence/data/django/*" {
    capabilities = ["read"]
}
EOF

# /vault-data/approle/back 디렉토리가 없으면 생성
mkdir -p /vault-data/approle/back
# /vault-data/approle/back/secret-id.json 파일이 있으면 삭제
rm -f /vault-data/approle/back/secret-id.json

sleep 1

# AppRole 생성 및 설정
vault write auth/approle/role/backend-role \
    secret_id_ttl=24h \
    token_policies="backend-policy" \
    token_ttl=24h \
    token_max_ttl=24h

# role-id와 secret-id 생성 성공 여부 확인
until vault read -format=json auth/approle/role/backend-role/role-id > /vault-data/approle/back/role-id.json; do
    sleep 0.5
done

until vault write -f -format=json auth/approle/role/backend-role/secret-id > /vault-data/approle/back/secret-id.json; do
    sleep 0.5
done
