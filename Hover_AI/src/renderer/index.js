const apiKeyInput = document.getElementById("apiKey");
const toggleKeyButton = document.getElementById("toggleKey");
const connectButton = document.getElementById("connectBtn");
const statusElement = document.getElementById("status");
const getApiKeyButton = document.getElementById("getApiKey");
const apiSetup = document.getElementById("apiSetup");
const modelSetup = document.getElementById("modelSetup");
const modelSelect = document.getElementById("modelSelect");
const continueButton = document.getElementById("continueBtn");
const modelStatus = document.getElementById("modelStatus");


// Show / Hide API Key
toggleKeyButton.addEventListener("click", () => {

    const isHidden = apiKeyInput.type === "password";

    apiKeyInput.type = isHidden ? "text" : "password";

    toggleKeyButton.textContent = isHidden
        ? "Hide"
        : "Show";
});


// Connect Gemini
connectButton.addEventListener("click", async () => {

    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        statusElement.textContent =
            "Please enter your Gemini API key.";
        return;
    }

    connectButton.disabled = true;
    connectButton.textContent = "Connecting...";
    statusElement.textContent = "Connecting to Gemini...";

    try {

        await window.electronAPI.saveApiKey(apiKey);

        const models =
            await window.electronAPI.getAvailableModels();

        displayModels(models);

        apiSetup.hidden = true;
        modelSetup.hidden = false;

        statusElement.textContent =
            "Gemini connected successfully.";

    } catch (error) {

        console.error("Gemini connection error:", error);

        statusElement.textContent =
            "Unable to connect to Gemini.";

    } finally {

        connectButton.disabled = false;
        connectButton.textContent = "Connect Gemini";

    }
});


// Display Models
function displayModels(models) {

    modelSelect.innerHTML = "";

    if (!models || models.length === 0) {

        modelSelect.innerHTML = `
            <option value="">
                No compatible models found
            </option>
        `;

        continueButton.disabled = true;

        modelStatus.textContent =
            "No compatible Gemini models were found.";

        return;
    }

    models.forEach((model) => {

        const option = document.createElement("option");

        option.value = model.id;
        option.textContent = model.name;

        modelSelect.appendChild(option);

    });

    continueButton.disabled = false;

    modelStatus.textContent =
        `Selected: ${models[0].name}`;
}


// Dropdown change
modelSelect.addEventListener("change", () => {

    const selectedOption =
        modelSelect.options[modelSelect.selectedIndex];

    if (!selectedOption) {
        return;
    }

    modelStatus.textContent =
        `Selected: ${selectedOption.textContent}`;
});


// Continue
continueButton.addEventListener("click", async () => {

    const selectedModel = modelSelect.value;

    if (!selectedModel) {
        return;
    }

    try {

        await window.electronAPI.saveSelectedModel(selectedModel);

        modelStatus.textContent =
            "Model selected successfully.";

        console.log("Selected model:", selectedModel);

    } catch (error) {

        console.error("Failed to save model:", error);

        modelStatus.textContent =
            "Failed to save selected model.";
    }
});

getApiKeyButton.addEventListener("click", async (event) => {

    event.preventDefault();

    try {

        await window.electronAPI.openApiKeyPage();

    } catch (error) {

        console.error("Failed to open API key page:", error);

    }

});

// Load saved API key when the Welcome Screen starts
async function loadSavedApiKey() {

    try {

        const savedApiKey =
            await window.electronAPI.getApiKey();

        if (savedApiKey) {

            apiKeyInput.value = savedApiKey;

            statusElement.textContent =
                "Saved API key loaded.";

        }

    } catch (error) {

        console.error(
            "Failed to load saved API key:",
            error
        );

    }
}

loadSavedApiKey();