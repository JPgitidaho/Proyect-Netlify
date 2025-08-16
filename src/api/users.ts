import { api } from './client'

export async function listUsers() {
  const { data, error } = await api.GET('/users')
  if (error) throw new Error('API error')
  return data ?? []
}

export async function createUser(body: { name: string; email: string; isOnline?: boolean }) {
  const { data, error } = await api.POST('/users', { body })
  if (error) throw new Error('Create error')
  return data
}
