import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null)
  const [userDoc, setUserDoc]           = useState(null)   // { identifier, isAdmin, characterId }
  const [loading, setLoading]           = useState(true)

  // Login: gracz wpisuje identyfikator, nie email
  async function login(identifier, password) {
    const email = `${identifier}@blackoutpost.local`
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    return signOut(auth)
  }

  // Nasłuchuj na zmianę auth state i załaduj dokument użytkownika
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid))
        setUserDoc(snap.exists() ? snap.data() : null)
      } else {
        setUserDoc(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const isAdmin      = userDoc?.isAdmin === true
  const characterId  = userDoc?.characterId ?? null
  const identifier   = userDoc?.identifier ?? null

  const value = {
    currentUser,
    userDoc,
    isAdmin,
    characterId,
    identifier,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
