const API_URL = 'https://eventhub-tuqt.onrender.com'

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

// Helper function to make API calls with token
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token")
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    console.log("[v0] API Call:", `${API_URL}${endpoint}`)
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    let data
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      // If response is not JSON (e.g., HTML error page), create error object
      const text = await response.text()
      console.error("[v0] Non-JSON response:", text.substring(0, 200))
      data = { message: `Server error: ${response.status} ${response.statusText}` }
    }

    if (!response.ok) {
      console.error("[v0] API Error:", data)
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    console.log("[v0] API Success:", endpoint)
    return { data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred"
    console.error("[v0] API Exception:", errorMessage)
    return {
      error: errorMessage,
    }
  }
}

// Auth API calls
export const authApi = {
  login: (email: string, password: string) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    apiCall("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role: "student" }),
    }),
}

// User API calls
export const userApi = {
  getProfile: () => apiCall("/api/users/profile"),

  updateProfile: (name: string, avatar?: string) =>
    apiCall("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify({ name, avatar }),
    }),

  getAll: () => apiCall("/api/users"),
}

// Event API calls
export const eventApi = {
  getAll: () => apiCall("/api/events"),

  getById: (id: string) => apiCall(`/api/events/${id}`),

  create: (eventData: any) =>
    apiCall("/api/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  update: (id: string, eventData: any) =>
    apiCall(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),

  delete: (id: string) =>
    apiCall(`/api/events/${id}`, {
      method: "DELETE",
    }),

  register: (id: string) =>
    apiCall(`/api/events/${id}/register`, {
      method: "POST",
    }),

  unregister: (id: string) =>
    apiCall(`/api/events/${id}/unregister`, {
      method: "POST",
    }),

  getAttendees: (id: string) => apiCall(`/api/events/${id}/attendees`),

  getRegistrationTrend: () => apiCall("/api/events/analytics/registration-trend"),
}

// Resource management API calls
export const resourceApi = {
  // Venue APIs
  venues: {
    getAll: () => apiCall("/api/resources/venues"),
    getById: (id: string) => apiCall(`/api/resources/venues/${id}`),
    create: (data: any) =>
      apiCall("/api/resources/venues", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/api/resources/venues/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/api/resources/venues/${id}`, {
        method: "DELETE",
      }),
  },

  // Equipment APIs
  equipment: {
    getAll: () => apiCall("/api/resources/equipment"),
    getById: (id: string) => apiCall(`/api/resources/equipment/${id}`),
    create: (data: any) =>
      apiCall("/api/resources/equipment", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/api/resources/equipment/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/api/resources/equipment/${id}`, {
        method: "DELETE",
      }),
  },

  // Personnel APIs
  personnel: {
    getAll: () => apiCall("/api/resources/personnel"),
    getById: (id: string) => apiCall(`/api/resources/personnel/${id}`),
    create: (data: any) =>
      apiCall("/api/resources/personnel", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/api/resources/personnel/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/api/resources/personnel/${id}`, {
        method: "DELETE",
      }),
  },

  // Event Calendar APIs
  calendar: {
    getAll: () => apiCall("/api/resources/calendar"),
    getById: (id: string) => apiCall(`/api/resources/calendar/${id}`),
    create: (data: any) =>
      apiCall("/api/resources/calendar", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/api/resources/calendar/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/api/resources/calendar/${id}`, {
        method: "DELETE",
      }),
    getId: (eventId: string) => apiCall(`/api/resources/calendar/event/${eventId}`)

  },
}
