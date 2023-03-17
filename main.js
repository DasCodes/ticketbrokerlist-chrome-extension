let inputForm = document.querySelector('.apikey-form');
let toastEl = document.querySelector('.toast');

const header = new Headers({
  'X-RapidAPI-Key': '382a86a41cmsh3d4b4de243c8c96p1ae3efjsnfc7189fa70bb',
  'X-RapidAPI-Host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
});

const toogleToast = (text, type) => {
  toastEl.style.display == 'none' || toastEl.style.display == '' ? toastEl.style.display = 'flex' : toastEl.style.display = 'none';
  if (text) {
    document.querySelector('.toast-text').innerHTML = text;
  }
  switch (type) {
    case 'success':
      toastEl.style.backgroundColor = '#3fbd63c4';
      break;
    case 'warning':
      toastEl.style.backgroundColor = '#ef9400c4';
      break;
    case 'danger':
      toastEl.style.backgroundColor = '#ea4e2cc4';
      break;
    default:
      toastEl.style.backgroundColor = '#0069dec4';
  }
}

async function fetchData(url, apiKey) {
  const res = await fetch('https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?ip=' + url + '&apikey=' + apiKey, { headers: header });
  const data = await res.json();
  if (data.status != 200) {
    toogleToast('IP is not found in the database!', 'danger');
  } else {
    document.getElementById('country').innerHTML = data.countryNativeName;
    document.getElementById('countryCode').innerHTML = data.countryISO3;
    document.getElementById('ip').innerHTML = data.ip;
    document.getElementById('network').innerHTML = data.network;
    document.getElementById('timezone').innerHTML = data.timezone;
    
    const flagEl = document.getElementById('flag');
    let img = document.createElement('img');
    img.src = data.flag;
    img.alt = 'Country Flag';
    img.style.height = '20px';

    flagEl.appendChild(img);
  }
}

const checkApiKey = async(key) => {
  const res = await fetch('https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?ip=www.google.com&apikey=' + key, { headers: header });
  const data = await res.json();

  if (data.status != 200) {
    toogleToast('Please check your key!', 'danger');
  } else {
    chrome.storage.local.set({
      webmetadatakey: key
    }).then(() => {
      console.log("Value is set to " + key);
    });
  }
}

if (chrome && chrome.storage) {
  chrome.storage.local.get('webmetadatakey', key => {
    if (!key.webmetadatakey) {
      inputForm.style.display = 'flex';
      document.getElementById('submitBtn').addEventListener('click', e => {
        e.preventDefault();
        if (document.getElementById('userApiKey').value.length < 32) {
          toogleToast('Enter a valid key!', 'danger');
        } else {
          const api = document.getElementById('userApiKey').value;
          checkApiKey(api);
        }
      });
    } else {
      inputForm.style.display = 'none';
      const apiKey = key.webmetadatakey;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        const url = new URL(activeTab.url);
        fetchData(url.hostname, apiKey);
      })
    }
  })
}
