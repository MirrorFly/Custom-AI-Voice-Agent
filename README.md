This README provides a comprehensive guide to building and integrating a custom AI Voice Agent using the **MirrorFly AI-RAG** platform.

---

# MirrorFly AI Voice Agent Integration

Build and integrate fully customizable AI voice agents for the web using the MirrorFly AI-RAG dashboard and SDK. This solution supports real-time audio streaming, external knowledge base training (RAG), and a no-code workflow builder.

## 🚀 Overview

The implementation is divided into two primary phases:

1. **Agent Creation:** Configuring the agent's personality, training it with datasets, and designing conversational flows in the MirrorFly dashboard.


2. **Agent Integration:** Embedding the agent into your web application using the MirrorFly AI SDK.



---

## 🛠 Part I: Agent Creation

### 1. Initial Setup

* **Access:** Obtain developer credentials from the MirrorFly team and log into the [MirrorFly AI Dashboard](https://ragchat.contus.us/).
  ![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-01.png)

* **Create Agent:** Click **'Create Agents'** and select **'Voice Agent'**.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-02.png)
* **Configuration:** Provide an agent name, description, and define the initial **System Prompt** to set core behavior.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-03.png)

### 2. Personality & Model Settings

* **Personality:** Set the welcome message, fallback responses, and adjust the formality and tone.


* **Model Selection:** Choose from multiple available AI models to power your agent.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-04.png)

### 3. Training with RAG (Retrieval-Augmented Generation)

* **Datasets:** Upload knowledge bases in **PDF** or **CSV** format (Max 5MB/10 files) to provide the agent with specific domain knowledge.


* **Website Sync:** Alternatively, sync information directly from a URL to keep the agent updated with your website content.

![MirrorFly Dashboard](./images/AI%20Voice%20Agent-Product-06.png)

### 4. Workflow Builder

Use the visual drag-and-drop canvas to define:

* Conversational paths and decision logic.


* API calls and form collection.


* Email triggers and message nodes.



### 5. Speech & Functions

* **STT/TTS:** Configure Speech-to-Text and Text-to-Speech providers (e.g., Deepgram, ElevenLabs) with your API keys.


* **Call Handling:** Enable functions like **Interruption Sensitivity**, **End Call**, or **Transfer to Human Agent** (via SIP or Conference).



---

## 💻 Part II: Agent Integration

### Prerequisites

* Valid **Agent ID** from the dashboard.


* Website must run on **HTTPS** for microphone access.


* Supported Browsers: Latest versions of Chrome, Edge, and Safari.



### 1. Install the SDK

Add the SDK to your HTML file using a single script tag:

```html
<script src="https://d1nzh49hhug3.cloudfront.net/aiVoiceScript/uat/mirrofly/mirror-fly-ai.v1.1.1.js"></script>

```



### 2. Initialize the Agent

Define a container element and initialize the SDK:

```javascript
// HTML Container
<div id="widget"></div>

// Initialization
MirrorFlyAi.init({
  container: "#widget",
  agentId: "<YOUR_AGENT_ID>",
  title: "Voice Assistant",
  theme: "dark",
  triggerStartCall: true,
  transcriptionEnable: true,
  transcriptionInUi: true,
  chatEnable: true,
  agentConnectionTimeout: 500
});

```



### 3. Handle Callbacks

Monitor the agent's status and capture transcriptions:

```javascript
const callbacks = {
  onTranscription: (data) => console.log("Transcription:", data),
  onAgentConnectionState: (state) => console.log("Connection:", state),
  onError: (error) => console.error("SDK Error:", error)
};

```



### 4. Dynamic Agent Switching

If your platform uses multiple agents (e.g., Sales vs. Support), use the following to switch contexts:

```javascript
function switchAgent(newAgentId) {
  MirrorFlyAi.destroy();
  document.querySelector("#widget").innerHTML = "";
  MirrorFlyAi.init({
    container: "#widget",
    agentId: newAgentId,
    triggerStartCall: true
  });
}

```



---

## 🛡 Security & Permissions

The browser will prompt the user for microphone permission upon initialization. Ensure you handle potential errors via the `onError` callback, such as permission denials or network issues.

Would you like me to generate the specific CSS styles to match the MirrorFly dashboard's look for your widget container?