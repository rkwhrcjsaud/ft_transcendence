FROM node:18

WORKDIR /usr/src/app

# package*.json 파일들을 복사
COPY package*.json ./

# 개발 의존성을 포함한 모든 의존성 설치
RUN npm ci
RUN npm install -g vite

# 나머지 소스 코드 복사
COPY . .

# 포트 설정
EXPOSE 5173

# 개발 서버 실행
CMD ["npm", "run", "dev"]