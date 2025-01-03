import axios from 'axios';

const VAULT_ADDR = "https://localhost:443";

export async function getVaultToken() {
    const roleId = "b7cfeb48-28fb-8ad9-848f-7bf6307ce250";
    const secretId = "a7da42dd-9ddd-3bc9-b61d-c4a4a0bc2e4b";

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

export async function getSecretValue(secretPath) {
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



// async function getVaultToken() {
//     // Role ID와 Secret ID 읽기
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

// // Vault에서 비밀 읽기
// async function getSecretValue(secretPath) {
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

// module.exports = { getVaultToken, getSecretValue };
