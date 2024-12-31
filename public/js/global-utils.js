export let generateAuthCode;
// public/js/global-utils.js

window.generateAuthCode = async function () {
    try {
        const response = await fetch('/api/inventory/generate-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to generate item ID');
        }

        const data = await response.json();
        return data.itemId; // Return the generated item ID
    } catch (error) {
        console.error('Error generating item ID:', error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};
