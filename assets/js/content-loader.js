// Function to load external HTML into an element
function loadHTML(selector, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      if (data.includes("File not found")) {
        window.location.href = "404.html";
        return;
      }
      document.querySelector(selector).innerHTML = data;
    })
    .catch(error => console.error('Error loading HTML:', error));
}

function loadFooterHeader() {
  loadHTML('header', 'header.html');
  loadHTML('footer', 'footer.html');
}

function loadMainContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const mainFile = urlParams.get('page') ? urlParams.get('page') + '.html' : null;

  if (mainFile) {
    loadHTML('main', mainFile);
  }
}


function loadDynamicContent() {

  document.querySelectorAll('[data-content]').forEach(el => {
    const file = el.getAttribute('data-content');
    loadHTML(`[data-content="${file}"]`, file);
  });

}



// Load header and footer on page load
document.addEventListener('DOMContentLoaded', () => {
  loadFooterHeader();
  loadMainContent();
  loadDynamicContent();
});