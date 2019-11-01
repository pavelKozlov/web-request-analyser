// document.querySelector('.reload-button > .reload-icon').style.background = chrome.extension.getURL('../../assets/reload.png');

document.getElementById('reload-button').addEventListener('click', () => {
  refresh();
});

document.getElementById('clear-button').addEventListener('click', () => {
  chrome.storage.local.clear();
  refresh();
});

document.getElementById('content-list').addEventListener('click', (event) => {
  const domain = event.target.querySelector('.domain-text').textContent;
  chrome.storage.local.get({
    disabled: {}
  },
  ({disabled}) => {
    let newDisabled = {
      ...disabled
    };
    let shouldDisabled = !disabled[domain];
    if (shouldDisabled) {
      newDisabled[domain] = true;
    } else {
      delete newDisabled[domain];
    }

    chrome.storage.local.set({
      disabled: newDisabled
    },
    () => {
      updateItem(domain, shouldDisabled);
    } 
  )
  })
});

document.addEventListener('DOMContentLoaded', function() {
  refresh();
});

function refresh() {
  chrome.storage.local.get({
      urlList: [],
      disabled: {}
    },
    (data) => {
      console.log('getDate callback:', data);
      addUrlsToTheDOM(
        groupData(data.urlList),
        data.disabled
      );
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

function addUrlsToTheDOM(urlList, disabled) {
  const list = document.getElementById('content-list');
  list.innerHTML = '';
  for (let data of urlList) {
    const isDisabled = disabled[data.domain];
    list.appendChild(getUrlElement(data, isDisabled));
  };
}

function getUrlElement({domain, count}, isDisabled) {
  const listItem = document.createElement('li');
  if (isDisabled) {
    listItem.classList.add('disabled');
  }
  const domainText = document.createElement('span');
  domainText.textContent = domain;
  domainText.className = 'domain-text';
  listItem.appendChild(domainText);

  const countText = document.createElement('span');
  countText.textContent = '(' + count + ')';
  listItem.appendChild(countText);

  return listItem;
}

function updateItem(text, isDisabled) {
  const list = document.querySelectorAll('#content-list > li');
  for (let domainElement of list) {
    if (domainElement.querySelector('.domain-text').textContent === text) {
      const method = isDisabled ? 'add' : 'remove';
      domainElement.classList[method]('disabled');
      console.log('found!');
      break;
    }
  }

}