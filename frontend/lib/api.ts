// Calls to FastAPI backend
const BASE_URL = 'http://localhost:8000';

function getToken() : string | null {
    return localStorage.getItem('token');
}

function authHeaders() {
    return { 'Authorization': `Bearer ${getToken()}` };
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
        headers: authHeaders()
    })
    if (!res.ok) throw new Error('Not authenticated');
    return res.json()
}

export async function savePreferences(data: {
    goal: string,
    experience: string,
    days_per_week: number,
    minutes_per_session?: number,
    minutes_per_day?: number,
    bible_version: string,
    time_of_day: string
}) {
    const res = await fetch(`${BASE_URL}/preferences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        },
        body: JSON.stringify({
            ...data,
            minutes_per_day: data.minutes_per_day ?? data.minutes_per_session ?? 15
        })
    })
    return res.json()
}

export async function getPreferences() {
    const res = await fetch(`${BASE_URL}/preferences`, {
        headers: authHeaders()
    })
    if (!res.ok) throw new Error('Preferences not found')
    return res.json()
}

export async function getReadings() {
    const res = await fetch(`${BASE_URL}/readings/`, {
        headers: authHeaders()
    })
    if (!res.ok) throw new Error('Unable to load readings')
    return res.json()
}

export async function logReading(data: {
    passage: string,
    date_read: string,
    notes?: string
}) {
    const res = await fetch(`${BASE_URL}/readings/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Unable to log reading')
    return res.json()
}

export async function getDashboardStats() {
    const [streak, count, week, month, longest, activity] = await Promise.all([
        fetch(`${BASE_URL}/readings/streak`, { headers: authHeaders() }).then((res) => res.json()),
        fetch(`${BASE_URL}/readings/count`, { headers: authHeaders() }).then((res) => res.json()),
        fetch(`${BASE_URL}/readings/this-week`, { headers: authHeaders() }).then((res) => res.json()),
        fetch(`${BASE_URL}/readings/this-month`, { headers: authHeaders() }).then((res) => res.json()),
        fetch(`${BASE_URL}/readings/longest-streak`, { headers: authHeaders() }).then((res) => res.json()),
        fetch(`${BASE_URL}/readings/activity`, { headers: authHeaders() }).then((res) => res.json()),
    ])

    return { streak, count, week, month, longest, activity }
}
