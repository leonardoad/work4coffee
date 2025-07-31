async function sendMailgunEmail(formData) {
    const apiKey = 'YOUR_MAILGUN_API_KEY'; // Replace with your Mailgun API key
    const domain = 'YOUR_DOMAIN_NAME'; // Replace with your Mailgun domain (e.g., sandbox123.mailgun.org)
    const url = `https://api.mailgun.net/v3/${domain}/messages`;

    const data = new URLSearchParams();
    data.append('from', `Contact Form <mailgun@${domain}>`);
    data.append('to', 'hello@businessdemo.com'); // Change to your receiving email
    data.append('subject', formData.get('subject'));
    data.append('text', `
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Message: ${formData.get('message')}
    `);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa('api:' + apiKey),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    });

    return response.ok;
}

// Add a MutationObserver to detect when the form is dynamically added to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const form = document.querySelector('.php-email-form');
            if (form) {
                console.log('Form found:', form);
                initializeForm(form); // Call the function to set up the form
                observer.disconnect(); // Stop observing once the form is found
            }
        }
    }
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

// Function to initialize the form event listener
function initializeForm(form) {
    const loading = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const sentMessage = document.querySelector('.sent-message');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        loading.style.display = 'block';
        errorMessage.style.display = 'none';
        sentMessage.style.display = 'none';

        const formData = new FormData(form);

        try {
            const success = await sendMailgunEmail(formData);
            loading.style.display = 'none';
            if (success) {
                sentMessage.style.display = 'block';
                form.reset();
            } else {
                errorMessage.textContent = 'Failed to send message. Please try again later.';
                errorMessage.style.display = 'block';
            }
        } catch (err) {
            loading.style.display = 'none';
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
    });
}
