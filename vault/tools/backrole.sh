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

mkdir -p /vault-data/approle/back

# AppRole 생성 및 설정
vault write auth/approle/role/backend-role \
    secret_id_ttl=24h \
    token_policies="backend-policy" \
    token_ttl=24h \
    token_max_ttl=24h

vault read -format=json auth/approle/role/backend-role/role-id > /vault-data/approle/back/role-id.json
vault write -f -format=json auth/approle/role/backend-role/secret-id > /vault-data/approle/back/secret-id.json