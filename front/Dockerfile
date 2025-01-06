FROM node:18
WORKDIR /usr/src/app

# 소스 코드 복사
COPY . .

# 개발 의존성을 포함한 모든 의존성 설치
RUN npm install -g vite

# 포트 설정
EXPOSE 5173

ENTRYPOINT ["./setup.sh"]