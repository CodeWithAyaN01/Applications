// API Key
// Selected Model
// Persistence

import keytar from "keytar";

const SERVICE_NAME = "HoverAI";
const API_KEY_ACCOUNT = "gemini-api-key";

let selectedModel = "gemini-2.5-flash";

export async function saveApiKey(apiKey) {
    await keytar.setPassword(
        SERVICE_NAME,
        API_KEY_ACCOUNT,
        apiKey
    );
}

export async function getApiKey() {
    return await keytar.getPassword(
        SERVICE_NAME,
        API_KEY_ACCOUNT
    );
}

export async function deleteApiKey() {
    await keytar.deletePassword(
        SERVICE_NAME,
        API_KEY_ACCOUNT
    );
}

export function saveSelectedModel(model) {
    selectedModel = model;
}

export function getSelectedModel() {
    return selectedModel;
}

export async function getConfiguration() {
    const apiKey = await getApiKey();

    return {
        apiKey,
        model: selectedModel
    };
}