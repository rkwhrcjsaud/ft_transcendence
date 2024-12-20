/*
ranchoi : vault.js가 CommonJS 방식(module.exports)으로 작성됐는데 모듈 방식 (import { } from)으로 불러오려고 해서 충돌이 발생하는거 같습니다. 아래 주석처리된 코드는 프론트 작업 렌더링 하기 위해 임시로 넣은 코드입니다!
*/

// export async function getVaultToken() {
//     const roleId = JSON.parse(fs.readFileSync(ROLE_ID_FILE, 'utf-8')).data.role_id;
//     const secretId = JSON.parse(fs.readFileSync(SECRET_ID_FILE, 'utf-8')).data.secret_id;

//     try {
//         const response = await axios.post(`${VAULT_ADDR}/v1/auth/approle/login`, {
//             role_id: roleId,
//             secret_id: secretId
//         });
//         return response.data.auth.client_token;
//     } catch (error) {
//         console.error('Failed to get Vault token:', error);
//         throw error;
//     }
// }

// export async function getSecretValue(secretPath) {
//     try {
//         const token = await getVaultToken();
//         const response = await axios.get(`${VAULT_ADDR}/v1/transcendence/data/${secretPath}`, {
//             headers: { 'X-Vault-Token': token }
//         });
//         return response.data.data.data.envvalue;
//     } catch (error) {
//         console.error('Failed to get secret value:', error);
//         throw error;
//     }
// }


const axios = require('axios');
const fs = require('fs');

const VAULT_ADDR = process.env.VAULT_ADDR;
const ROLE_ID_FILE = process.env.ROLE_ID_FILE;
const SECRET_ID_FILE = process.env.SECRET_ID_FILE;

async function getVaultToken() {
    // Role ID와 Secret ID 읽기
    const roleId = JSON.parse(fs.readFileSync(ROLE_ID_FILE, 'utf-8')).data.role_id;
    const secretId = JSON.parse(fs.readFileSync(SECRET_ID_FILE, 'utf-8')).data.secret_id;

    try {
        const response = await axios.post(`${VAULT_ADDR}/v1/auth/approle/login`, {
            role_id: roleId,
            secret_id: secretId
        });
        return response.data.auth.client_token;
    } catch (error) {
        console.error('Failed to get Vault token:', error);
        throw error;
    }
}

// Vault에서 비밀 읽기
async function getSecretValue(secretPath) {
    try {
        const token = await getVaultToken();
        const response = await axios.get(`${VAULT_ADDR}/v1/transcendence/data/${secretPath}`, {
            headers: { 'X-Vault-Token': token }
        });
        return response.data.data.data.envvalue;
    } catch (error) {
        console.error('Failed to get secret value:', error);
        throw error;
    }
}

module.exports = { getVaultToken, getSecretValue };
