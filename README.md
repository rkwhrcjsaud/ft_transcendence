# 필수 요구 사항
Docker 및 Docker-Compose 설치
Node.js 및 npm 설치
python 및 pip 설치

# node.js 의존성 설치
cd front
npm install

# python 가상 환경 설정
cd back
python -m venv venv
source venv/bin/activate

# backend 의존성 설치
pip install -r requirements.txt
