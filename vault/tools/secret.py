import os
import hvac
from dotenv import load_dotenv

# 환경변수 로드 (env_file에서 제공)
load_dotenv()

# Vault 클라이언트 초기화
VAULT_ADDR = os.getenv("VAULT_ADDR")
VAULT_TOKEN_FILE = os.getenv("VAULT_ROOT_TOKEN")  # 토큰 파일 경로
VAULT_ENGINE_PATH = "transcendence"  # 기본 엔진 경로

# 토큰 파일에서 토큰 읽기
def read_vault_token(token_file_path):
    try:
        with open(token_file_path, "r") as token_file:
            return token_file.read().strip()
    except FileNotFoundError:
        print(f"토큰 파일을 찾을 수 없습니다: {token_file_path}")
        exit(1)

# Vault 클라이언트 인증
vault_token = read_vault_token(VAULT_TOKEN_FILE)
client = hvac.Client(url=VAULT_ADDR, token=vault_token)

if not client.is_authenticated():
    print("Vault 인증 실패!")
    exit(1)

# 비밀 엔진에서 모든 데이터 삭제
def delete_all_secrets(engine_path):
    try:
        secrets_list = client.secrets.kv.v2.list_secrets(path="", mount_point=engine_path)
        for secret in secrets_list['data']['keys']:
            if secret.endswith('/'):
                # Nested 경로 재귀 삭제
                delete_all_secrets(f"{engine_path}/{secret}")
            else:
                client.secrets.kv.v2.delete_metadata_and_all_versions(
                    path=secret,
                    mount_point=engine_path
                )
    except hvac.exceptions.InvalidPath:
        print(f"'{engine_path}' 경로에 저장된 비밀이 없습니다.")
    except Exception as e:
        print(f"오류 발생: {e}")
        exit(1)

# 모든 환경변수를 저장
def save_ts_env_variables(base_engine_path):
    vault_env_variables = {key: value for key, value in os.environ.items() if key.startswith("VAULT_")}
    back_env_variables = {key: value for key, value in os.environ.items() if key.startswith("BACK_")}
    front_env_variables = {key: value for key, value in os.environ.items() if key.startswith("FRONT_")}

    def save_env_to_vault(env_dict, sub_path):
        for key, value in env_dict.items():
            secret_data = {
                "envname": key,
                "envvalue": value
            }
            try:
                client.secrets.kv.v2.create_or_update_secret(
                    path=f"{sub_path}/{key}",  # 경로와 환경 변수 이름 결합
                    secret=secret_data,
                    mount_point=base_engine_path
                )
            except Exception as e:
                print(f"비밀 '{key}' 저장 중 오류 발생: {e}")
                exit(1)

    # 각각의 환경변수를 다른 경로로 저장
    save_env_to_vault(vault_env_variables, "vault")
    save_env_to_vault(back_env_variables, "back")
    save_env_to_vault(front_env_variables, "front")
    
# 기존 데이터 삭제 및 환경변수 저장
delete_all_secrets(VAULT_ENGINE_PATH)
save_ts_env_variables(VAULT_ENGINE_PATH)