// Calls to FastAPI backend
const BASE_URL = 'http://localhost:8000';

function getToken() : string | null {
    return localStorage.getItem('token');
}

export async function register(name: string, email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify ({name, email, password})
    })
    if (!res.ok) throw new Error('Registration failed');
    return res.json()
}

export async function login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({username: email, password})
    })
    if (!res.ok) throw new Error('Invalid email or password')
    const data = await res.json()
    localStorage.setItem('token', data.access_token)
    return data
}

export async function getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!res.ok) throw new Error('Not authenticated');
    return res.json()
}

export async function savePreferences(data: {
    goal: string,
    experience: string,
    days_per_week: number,
    minutes_per_day: number,
    bible_version: string,
    time_of_day: string
}) {
    const res = await fetch(`${BASE_URL}/preferences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    })
    return res.json()
}
