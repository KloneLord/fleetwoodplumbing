async function fetchSessionData() {
    try {
        const response = await fetch('/api/sessions/info');
        if (!response.ok) throw new Error('Failed to fetch session data');
        const data = await response.json();
        console.log('Session data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching session data:', error);
        return null;
    }
}