import os
import json
from django.http import JsonResponse

def get_vault_data(request):
    # vite의 볼륨 경로
    role_id_path = '/usr/src/app/approle/front/role-id.json'
    secret_id_path = '/usr/src/app/approle/front/secret-id.json'

    try:
        # JSON 파일 읽기
        with open(role_id_path, 'r') as role_file:
            role_data = json.load(role_file)
        with open(secret_id_path, 'r') as secret_file:
            secret_data = json.load(secret_file)

        # role-id와 secret-id 반환
        return JsonResponse({
            'role_id': role_data.get('data', {}).get('role_id', ''),
            'secret_id': secret_data.get('data', {}).get('secret_id', '')
        })
    except FileNotFoundError as e:
        return JsonResponse({'error': 'File not found', 'message': str(e)}, status=404)
    except Exception as e:
        return JsonResponse({'error': 'An error occurred', 'message': str(e)}, status=500)
