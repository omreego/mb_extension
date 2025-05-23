document.addEventListener('DOMContentLoaded', function() {
  const checkSessionButton = document.getElementById('checkSession');
  const sendRequestButton = document.getElementById('sendRequest');
  const statusDiv = document.getElementById('status');
  const connectionStatusDiv = document.getElementById('connectionStatus');
  const endpointInput = document.getElementById('endpoint');
  const payloadInput = document.getElementById('payload');
  const methodSelect = document.getElementById('method');
  const responseArea = document.getElementById('responseArea');

  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    statusDiv.className = 'status ' + (isError ? 'error' : 'success');
  }

  function updateConnectionStatus(isConnected) {
    connectionStatusDiv.textContent = isConnected ? 'Connected to Metabase' : 'Not connected to Metabase';
    connectionStatusDiv.className = isConnected ? 'success' : 'error';
  }

  function displayResponse(response, isError = false) {
    responseArea.style.display = 'block';
    responseArea.style.backgroundColor = isError ? '#fff0f0' : '#f5f5f5';
    responseArea.textContent = typeof response === 'string' 
      ? response 
      : JSON.stringify(response, null, 2);
  }

  // Check for Metabase session cookie
  chrome.cookies.getAll({ name: 'metabase.SESSION' }, function(cookies) {
    updateConnectionStatus(cookies.length > 0);
  });

  checkSessionButton.addEventListener('click', async () => {
    try {
      const response = await chrome.runtime.sendMessage({action: 'getSessionToken'});
      if (response.success) {
        updateStatus('Session token retrieved successfully!');
      } else {
        updateStatus('Failed to get session token: ' + response.error, true);
      }
    } catch (error) {
      updateStatus('Error: ' + error.message, true);
    }
  });

  sendRequestButton.addEventListener('click', async () => {
    try {
      // Validate endpoint
      const endpoint = endpointInput.value.trim();
      if (!endpoint) {
        throw new Error('Please enter an API endpoint');
      }

      // Validate and parse payload if present
      let payload = null;
      if (payloadInput.value.trim()) {
        try {
          payload = JSON.parse(payloadInput.value);
        } catch (e) {
          throw new Error('Invalid JSON payload');
        }
      }

      // Get the session token
      const tokenResponse = await chrome.runtime.sendMessage({action: 'getSessionToken'});
      if (!tokenResponse.success) {
        throw new Error('Failed to get session token');
      }

      // Make the API request
      const response = await chrome.runtime.sendMessage({
        action: 'makeApiCall',
        endpoint: endpoint,
        method: methodSelect.value,
        payload: payload,
        token: tokenResponse.token
      });

      if (response.success) {
        displayResponse(response.data);
        updateStatus('API request successful');
      } else {
        displayResponse(response.error, true);
        updateStatus('API request failed', true);
      }
    } catch (error) {
      displayResponse(error.message, true);
      updateStatus(error.message, true);
    }
  });
}); 