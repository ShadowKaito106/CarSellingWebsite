export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const endpoints = {
  vehicles: {
    list: `${API_URL}/vehicles`,
    search: `${API_URL}/vehicles/search`,
    getByType: (type: string) => `${API_URL}/vehicles/type/${type}`,
    detail: (id: string) => `${API_URL}/vehicles/${id}`,
    create: `${API_URL}/vehicles`,
    update: (id: string) => `${API_URL}/vehicles/${id}`,
    delete: (id: string) => `${API_URL}/vehicles/${id}`,
    userVehicles: `${API_URL}/vehicles/user`,
    upload: `${API_URL}/vehicles/upload`,
  },
  auth: {
    login: `${API_URL}/users/login`,
    register: `${API_URL}/users/register`,
    refreshToken: `${API_URL}/users/refresh-token`,
    currentUser: `${API_URL}/users/profile`,
    updateProfile: `${API_URL}/users/profile`,
    uploadAvatar: `${API_URL}/users/avatar`,
    uploadCoverImage: `${API_URL}/users/cover-image`,
  },
  favorites: {
    add: (vehicleId: string) => `${API_URL}/users/favorites/${vehicleId}`,
    remove: (vehicleId: string) => `${API_URL}/users/favorites/${vehicleId}`,
  },
  kyc: {
    uploadDocuments: `${API_URL}/users/upload-kyc-documents`,
    update: `${API_URL}/users/update-kyc`,
  },
  API_URL,
} 