import { createContext, useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]       = useState(null)
  const [userDoc, setUserDoc]               = useState(undefined) // undefined = nie załadowany jeszcze
  const [authLoading, setAuthLoading]       = useState(true)

  async function login(identifier, password) {
    const email = `${identifier}@blackoutpost.local`
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    setUserDoc(undefined)
    return signOut(auth)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid))
          setUserDoc(snap.exists() ? snap.data() : null)
        } catch {
          setUserDoc(null)
        }
      } else {
        setUserDoc(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const isAdmin     = userDoc?.isAdmin === true
  const characterId = userDoc?.characterId ?? null
  const identifier  = userDoc?.identifier  ?? null
  // userDoc === undefined: jeszcze się ładuje
  // userDoc === null: załadowany, brak danych
  // userDoc === {}: załadowany
  const userDocReady = userDoc !== undefined

  return (
    <AuthContext.Provider value={{
      currentUser, userDoc, userDocReady,
      isAdmin, characterId, identifier,
      login, logout,
      loading: authLoading,
    }}>
      {!authLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
