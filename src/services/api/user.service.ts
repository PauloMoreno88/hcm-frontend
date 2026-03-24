import { http } from './client'

export const userService = {
  updatePreferences(prefs: { healthScoreEnabled: boolean }): Promise<void> {
    return http.patch('/users/preferences', prefs)
  },
}
