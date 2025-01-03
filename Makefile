# 모든 컨테이너 빌드 및 실행
all: mount
	@docker-compose up --build

# 백그라운드 모드에서 컨테이너 빌드 및 실행
detach: mount
	@docker-compose up --build -d

# 컨테이너 종료 및 볼륨 삭제
down:
	@docker-compose down --volumes

# 컨테이너 중지 후 재빌드 및 실행
reup: down
	$(MAKE) all

# 파일 변경 감지 후 업데이트
watch: mount
	docker compose watch

mount:
	@mkdir -p volumes/vault-data/approle/back
	@mkdir -p volumes/vault-data/approle/front

# 컨테이너 정지 및 도커 리소스 삭제
clean: down
	@docker system prune -a

# 컨테이너 정지 및 도커 리소스와 볼륨 삭제
fclean: down
	@docker system prune -f -a --volumes
	@find volumes/vault-data -type f -exec rm -f {} +

.PHONY: all detach down reup watch mount clean fclean
