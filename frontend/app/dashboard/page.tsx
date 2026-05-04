// Login Page

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register, login } from '@/lib/api'

export default function Home() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
}