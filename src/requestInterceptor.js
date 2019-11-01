let urlRequests = [];

chrome.storage.local.get({
    urlList: [],
  },
  ({urlList}) => {
    urlRequests = urlList;
  } 
)

setInterval(() => {
  chrome.storage.local.set({
    urlList: urlRequests,
  })
}, 1000);

console.log('another log')

chrome.webRequest.onBeforeRequest.addListener(
  function({url, initiator, type}) {
    const match = url.match(/http[s]:\/\/([\w.]+)/, '');
    if (match) {
      urlRequests.push({
        domain: match[1],
        url,
        initiator,
        type
      });
    }
    return {
      cancel: false // details.url.includes('://www.google-analytics.com')
    }
  },
  {
    urls: [
      '<all_urls>'
    ]
  }, [
    'blocking'
  ]
);