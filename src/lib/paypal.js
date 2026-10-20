const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = String(process.env.PAYPAL_ENV || "sandbox").toLowerCase();

export function hasPayPalConfig() {
  return Boolean(clientId && clientSecret);
}

export function getPayPalClientId() {
  return clientId || "";
}

export function getPayPalBaseUrl() {
  return environment === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  if (!hasPayPalConfig()) {
    throw new Error("PayPal is not configured.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Could not authenticate with PayPal.");
  }

  return data.access_token;
}

async function paypalRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.details?.[0]?.description || data?.message || "PayPal request failed.";
    const error = new Error(detail);
    error.status = response.status;
    error.paypal = data;
    throw error;
  }

  return data;
}

export async function createPayPalOrder({ amount, currency, description, customId }) {
  return paypalRequest("/v2/checkout/orders", {
    method: "POST",
    headers: {
      "PayPal-Request-Id": crypto.randomUUID()
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: "default",
        custom_id: customId,
        description: String(description || "").slice(0, 127),
        amount: {
          currency_code: currency,
          value: Number(amount).toFixed(2)
        }
      }]
    })
  });
}

export async function capturePayPalOrder(orderId) {
  return paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: {
      "PayPal-Request-Id": crypto.randomUUID()
    },
    body: "{}"
  });
}
