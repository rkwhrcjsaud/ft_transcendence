import os
import requests
import json

VAULT_ADDR = os.getenv('VAULT_ADDR')
ROLE_ID_FILE = os.getenv('ROLE_ID_FILE')
SECRET_ID_FILE = os.getenv('SECRET_ID_FILE')

def get_vault_token():
    # Role ID와 Secret ID 읽기
    with open(ROLE_ID_FILE, 'r') as role_id_file:
        role_id = json.load(role_id_file)['data']['role_id']

    with open(SECRET_ID_FILE, 'r') as secret_id_file:
        secret_id = json.load(secret_id_file)['data']['secret_id']

    response = requests.post(f"{VAULT_ADDR}/v1/auth/approle/login", json={
        "role_id": role_id,
        "secret_id": secret_id
    })
    client_token = response.json()['auth']['client_token']
    return client_token

# Vault에서 비밀 읽기
def getSecretValue(secret_path):
    token = get_vault_token()
    headers = {"X-Vault-Token": token}
    response = requests.get(f"{VAULT_ADDR}/v1/transcendence/data/{secret_path}", headers=headers)
    response.raise_for_status()
    return response.json()['data']['data'].get('envvalue')