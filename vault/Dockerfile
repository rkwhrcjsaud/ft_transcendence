# Vault의 최신 버전을 사용하는 공식 HashiCorp Vault 이미지
FROM hashicorp/vault:latest

# 필요한 패키지 설치를 위해 apk 사용
USER root
RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    py3-virtualenv \
    netcat-openbsd \
    curl

# Python 가상 환경 생성 및 활성화
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Python 패키지 설치
COPY ./tools/requirements.txt /
RUN pip install --no-cache-dir -r /requirements.txt

# 스크립트 및 설정 파일 복사
COPY ./tools/setup.sh /
COPY ./tools/backrole.sh /
COPY ./tools/frontrole.sh /
COPY ./tools/secret.py /
COPY ./tools/local.json /

# 실행 권한 부여
RUN chmod +x /setup.sh
RUN chmod +x /backrole.sh
RUN chmod +x /frontrole.sh

# Vault 서버 실행
ENTRYPOINT ["/setup.sh"]