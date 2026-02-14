"use client"

import { useMemo } from "react"

interface PasswordStrengthMeterProps {
    password: string
}

interface StrengthResult {
    score: number // 0-4
    label: string
    color: string
    bgColor: string
    feedback: string[]
}

function calculatePasswordStrength(password: string): StrengthResult {
    let score = 0
    const feedback: string[] = []

    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    else if (password.length < 8) feedback.push("Use at least 8 characters")

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score++
    } else {
        feedback.push("Add uppercase letters")
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score++
    } else {
        feedback.push("Add lowercase letters")
    }

    // Number check
    if (/\d/.test(password)) {
        score++
    } else {
        feedback.push("Add numbers")
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score++
    } else {
        feedback.push("Add special characters (!@#$%...)")
    }

    // Common patterns check (reduce score)
    const commonPatterns = [
        /^123/,
        /^abc/i,
        /password/i,
        /qwerty/i,
        /admin/i,
        /letmein/i,
    ]
    
    if (commonPatterns.some(pattern => pattern.test(password))) {
        score = Math.max(0, score - 2)
        feedback.push("Avoid common patterns")
    }

    // Sequential characters check
    if (/(.)\1{2,}/.test(password)) {
        score = Math.max(0, score - 1)
        feedback.push("Avoid repeating characters")
    }

    // Normalize score to 0-4
    const normalizedScore = Math.min(4, Math.floor(score / 1.5))

    // Determine label and color
    let label = "Very Weak"
    let color = "text-red-600"
    let bgColor = "bg-red-500"

    if (normalizedScore === 1) {
        label = "Weak"
        color = "text-orange-600"
        bgColor = "bg-orange-500"
    } else if (normalizedScore === 2) {
        label = "Fair"
        color = "text-yellow-600"
        bgColor = "bg-yellow-500"
    } else if (normalizedScore === 3) {
        label = "Good"
        color = "text-lime-600"
        bgColor = "bg-lime-500"
    } else if (normalizedScore === 4) {
        label = "Strong"
        color = "text-green-600"
        bgColor = "bg-green-500"
        feedback.length = 0 // Clear feedback for strong passwords
        feedback.push("Excellent password!")
    }

    return {
        score: normalizedScore,
        label,
        color,
        bgColor,
        feedback,
    }
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    const strength = useMemo(() => calculatePasswordStrength(password), [password])

    if (!password) return null

    return (
        <div className="space-y-2">
            {/* Progress bar */}
            <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            index <= strength.score
                                ? strength.bgColor
                                : "bg-gray-200"
                        }`}
                    />
                ))}
            </div>

            {/* Label */}
            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${strength.color}`}>
                    Password Strength: {strength.label}
                </span>
            </div>

            {/* Feedback */}
            {strength.feedback.length > 0 && (
                <ul className="text-xs text-gray-600 space-y-1">
                    {strength.feedback.map((item, index) => (
                        <li key={index} className="flex items-start">
                            <span className="mr-1">
                                {strength.score === 4 ? "✓" : "•"}
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
