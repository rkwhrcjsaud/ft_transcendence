#!/bin/sh

# 환경 변수
ENV_FILE="/vault-data/.env"
HASH_FILE="/vault-data/.env.hash"
ROOT_TOKEN_FILE="/vault-data/root_token.txt"

# Vault에 로그인
vault login $(cat $ROOT_TOKEN_FILE)

# KV 엔진이 없는 경우 생성
vault secrets list | grep -q '^ts/' || vault secrets enable -path=ts kv

# .env 파일이 없으면 종료
if [ ! -f $ENV_FILE ]; then
    echo "$ENV_FILE 파일이 존재하지 않습니다."
    exit 1
fi

# .env 파일 변경 여부 확인
CURRENT_HASH=$(sha256sum $ENV_FILE | awk '{print $1}')
if [ -f $HASH_FILE ] && [ "$(cat $HASH_FILE)" = "$CURRENT_HASH" ]; then
    echo ".env 파일에 변경 사항이 없습니다. 데이터를 저장하지 않습니다."
    exit 0
fi

# 변경된 .env 파일을 읽어 Vault에 저장
while IFS='=' read -r key value; do
    # 빈 줄이나 주석(#으로 시작하는 줄)은 무시
    [ -z "$key" ] && continue
    [ "${key#\#}" != "$key" ] && continue
    
    # 문자열 값의 앞뒤 따옴표(") 제거
    value=$(echo "$value" | sed 's/^"//; s/"$//')
    
    # Vault KV에 데이터 저장
    vault kv put ts/env "envname=$key" "envvalue=$value"
done < $ENV_FILE

# .env 파일의 최신 해시 저장
echo $CURRENT_HASH > $HASH_FILE

echo ".env 파일의 데이터가 Vault에 성공적으로 저장되었습니다."
