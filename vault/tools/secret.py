import os
import hvac
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

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
        raise RuntimeError("Vault token file not found.")

# Vault 클라이언트 인증
vault_token = read_vault_token(VAULT_TOKEN_FILE)
client = hvac.Client(url=VAULT_ADDR, token=vault_token)

if not client.is_authenticated():
    raise RuntimeError("Vault authentication failed.")

# 비밀 엔진에서 모든 데이터 삭제
def delete_all_secrets(engine_path):
    try:
        secrets_list = client.secrets.kv.v2.list_secrets(path="", mount_point=engine_path)
        for secret in secrets_list['data']['keys']:
            full_path = f"{engine_path}/{secret}" if secret.endswith('/') else secret
            if secret.endswith('/'):
                delete_all_secrets(full_path)
            else:
                client.secrets.kv.v2.delete_metadata_and_all_versions(
                    path=full_path,
                    mount_point=engine_path
                )
    except hvac.exceptions.InvalidPath:
        return  # 엔진이 비어있을 경우 무시
    except Exception as e:
        return

# 환경변수 저장
def save_ts_env_variables(base_engine_path):
    env_prefixes = {
        "vault": "VAULT_",
        "back": "BACK_",
        "front": "FRONT_",
        "django": "DJANGO_"
    }

    def save_env_to_vault(env_dict, sub_path):
        for key, value in env_dict.items():
            secret_data = {"envname": key, "envvalue": value}
            try:
                client.secrets.kv.v2.create_or_update_secret(
                    path=f"{sub_path}/{key}",
                    secret=secret_data,
                    mount_point=base_engine_path
                )
            except Exception as e:
                return

    # 병렬 저장
    def process_env(prefix, sub_path):
        env_variables = {key: value for key, value in os.environ.items() if key.startswith(prefix)}
        save_env_to_vault(env_variables, sub_path)

    with ThreadPoolExecutor() as executor:
        for sub_path, prefix in env_prefixes.items():
            executor.submit(process_env, prefix, sub_path)

# 기존 데이터 삭제 및 환경변수 저장
delete_all_secrets(VAULT_ENGINE_PATH)
save_ts_env_variables(VAULT_ENGINE_PATH)