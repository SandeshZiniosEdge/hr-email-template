// src/api/notificationScenarios.ts

export interface NotificationScenario {
  id?: number;
  notificationScenario: string;
  smsRequired: boolean;
  smsBody?: string;
  emailRequired: boolean;
  emailSubject?: string;
  emailBody?: string;
  emailButtonName?: string;
  inPortalWebRequired: boolean;
  inPortalWebSubject?: string;
  inPortalWebBody?: string;
  inPortalWebLinkName?: string;
  mobilePushRequired: boolean;
  mobilePushSubject?: string;
  mobilePushBody?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = "http://localhost:5000/api/notification-scenarios";

export const fetchScenarios = async (
  page = 1,
  limit = 10,
  search = "",
  isActive?: boolean
): Promise<{
  success: boolean;
  data: {
    scenarios: NotificationScenario[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (isActive !== undefined) params.append("isActive", String(isActive));

  const res = await fetch(`${API_BASE_URL}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch scenarios");
  return await res.json();
};

export const fetchScenarioById = async (
  id: number
): Promise<{
  success: boolean;
  data: NotificationScenario;
}> => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Scenario not found");
  return await res.json();
};

export const createScenario = async (
  scenario: Partial<NotificationScenario>
): Promise<{
  success: boolean;
  message: string;
  data: NotificationScenario;
}> => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scenario),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create scenario");
  }

  return await res.json();
};

export const updateScenario = async (
  id: number,
  scenario: Partial<NotificationScenario>
): Promise<{
  success: boolean;
  message: string;
  data: NotificationScenario;
}> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scenario),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update scenario");
  }

  return await res.json();
};
