// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSessionToken') {
    getMetabaseSession()
      .then(token => {
        if (token) {
          sendResponse({ success: true, token: token });
        } else {
          sendResponse({ success: false, error: 'No session token found' });
        }
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.action === 'makeApiCall') {
    makeMetabaseApiCall(request.endpoint, request.token, request.method, request.payload)
      .then(data => {
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});

async function getMetabaseSession() {
  // Try to get the session cookie
  const cookies = await chrome.cookies.getAll({
    name: 'metabase.SESSION'
  });

  if (cookies.length > 0) {
    return cookies[0].value;
  }

  // If we couldn't find the cookie, try to get it from local storage
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: () => {
      return localStorage.getItem('metabase.SESSION');
    }
  });

  if (result[0].result) {
    return result[0].result;
  }

  throw new Error('Could not find Metabase session token');
}

async function makeMetabaseApiCall(endpoint, token, method = 'GET', payload = null) {
  try {
    const options = {
      method: method,
      headers: {
        'X-Metabase-Session': token,
        'Content-Type': 'application/json'
      }
    };

    if (payload && method !== 'GET') {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
} 