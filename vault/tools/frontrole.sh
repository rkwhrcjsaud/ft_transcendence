#!/bin/sh
# 프론트엔드용 정책 생성
vault policy write frontend-policy - <<EOF
path "transcendence/data/front/*" {
  capabilities = ["read"]
}
EOF

mkdir -p /vault-data/approle/front

# AppRole 생성 및 설정
vault write auth/approle/role/frontend-role \
    secret_id_ttl=24h \
    token_policies="frontend-policy" \
    token_ttl=24h \
    token_max_ttl=24h

vault read -format=json auth/approle/role/frontend-role/role-id > /vault-data/approle/front/role-id.json
vault write -f -format=json auth/approle/role/frontend-role/secret-id > /vault-data/approle/front/secret-id.json