import firestore from '@react-native-firebase/firestore'
import * as React from 'react'
import { User } from './types'
import { useFirebaseUser } from './useFirebaseUser'

export const useUsers = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const { user } = useFirebaseUser()

  React.useEffect(() => {
    if (!user) {
      setUsers([])
      return
    }

    return firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const newUsers: User[] = []

        querySnapshot.forEach((documentSnaphot) => {
          if (user.uid === documentSnaphot.id) return

          const avatarUrl =
            (documentSnaphot.get('avatarUrl') as string | null) ?? undefined
          const firstName = documentSnaphot.get('firstName') as string
          const lastName = documentSnaphot.get('lastName') as string

          const newUser: User = {
            avatarUrl,
            firstName,
            id: documentSnaphot.id,
            lastName,
          }

          newUsers.push(newUser)
        })

        setUsers(newUsers)
      })
  }, [user])

  const createUserInFirestore = async (userData: User) => {
    await firestore().collection('users').doc(userData.id).set({
      avatarUrl: userData.avatarUrl,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
  }

  return { createUserInFirestore, users }
}
