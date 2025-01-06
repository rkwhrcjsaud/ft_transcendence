FROM node:18

WORKDIR /usr/src/app

COPY . .

# 개발 의존성을 포함한 모든 의존성 설치
RUN npm install -g vite
RUN npm install

# 포트 설정
EXPOSE 5173

# 개발 서버 실행
CMD ["npm", "run", "dev"]