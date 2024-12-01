import requests

# Vault API URL과 헤더
url = "http://vault:8200/v1/transcendence/data/db/DB_ADDR"
headers = {
    "X-Vault-Token": ""
}

# GET 요청 보내기
response = requests.get(url, headers=headers)

# 응답이 성공적인 경우, 응답 내용 출력
if response.status_code == 200:
    print("Response Data:")
    data = response.json()  # JSON 형식으로 응답 데이터 받기
    
    # Vault의 데이터 구조를 확인하고 적절히 파싱
    if "data" in data:
        secret_data = data["data"]["data"]
        
        # secret_data가 dictionary라면 키와 값을 출력
        for envname, envvalue in secret_data.items():
            print(f"Env Name: {envname} | Env Value: {envvalue}")
    else:
        print("No 'data' found in the response.")
else:
    print(f"Failed to retrieve data: {response.status_code}")
    print(response.text)  # 실패 시 에러 메시지 출력
