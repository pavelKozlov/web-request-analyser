// document.querySelector('.reload-button > .reload-icon').style.background = chrome.extension.getURL('../../assets/reload.png');

document.getElementById('reload-button').addEventListener('click', () => {
  refresh();
});

document.getElementById('clear-button').addEventListener('click', () => {
  chrome.storage.local.clear();
  refresh();
});

console.log('popup.js');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded');
  refresh();
});

function refresh() {
  chrome.storage.local.get({
      urlList: [],
    },
    (data) => {
      console.log('getDate callback:', data);
      addUrlsToTheDOM(groupData(data.urlList));
    } 
  )
}

function groupData(urlList) {
  const hashMap = {};
  for (let urlItem of urlList) {
    if (!hashMap[urlItem.domain]) {
      hashMap[urlItem.domain] = 1;
    } else {
      hashMap[urlItem.domain]++;
    }
  }
  return Object.entries(hashMap).map(([key, value]) => ({
    domain: key, 
    count: value,
  }));
}

function addUrlsToTheDOM(urlList) {
  const list = document.getElementById('content-list');
  list.innerHTML = '';
  for (let data of urlList) {
    list.appendChild(getUrlElement(data));
  };
}

function getUrlElement({domain, count}) {
  const listItem = document.createElement('li');
  listItem.textContent = domain + '(' + count + ')';
  return listItem;
}