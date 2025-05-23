// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLocalStorage') {
    const value = localStorage.getItem(request.key);
    sendResponse({ value });
  }
});

// You can add more functionality here to interact with the Metabase page
// For example, you could listen for specific API responses or monitor network requests 