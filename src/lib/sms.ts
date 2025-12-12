
export interface SMSMessage {
  to: string;
  body: string;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS message using AfroMessage
 */
export async function sendSMS({ to, body }: SMSMessage): Promise<SMSResult> {
  // Debug: Log every time sendSMS is called
  console.log('[SMS] ════════════════════════════════════════════════');
  console.log('[SMS] sendSMS() function CALLED');
  console.log('[SMS] Call stack:', new Error().stack?.split('\n').slice(1, 5).join('\n'));
  console.log('[SMS] To:', to);
  console.log('[SMS] Message length:', body.length);
  
  try {
    // 0) Global kill-switch / dry-run: do not send, but report success to avoid UI "failed" toasts
    const disable = (process.env.AFRO_DISABLE_SMS || '').toLowerCase() === 'true'
      || (process.env.AFRO_SMS_DRY_RUN || '').toLowerCase() === 'true'
      || (process.env.DISABLE_SMS || '').toLowerCase() === 'true';
    if (disable) {
      console.log('[SMS] ⚠️ SMS SENDING IS DISABLED by configuration.');
      console.log('[SMS] Would send to:', to);
      console.log('[SMS] Message preview:', body.substring(0, 80) + '...');
      return { success: true, messageId: 'disabled' };
    }
    // 1) Read credentials
    const apiKey = process.env.AFRO_API_KEY;
    const senderName = process.env.AFRO_SENDER_NAME; // display name on recipient phone
    const callbackUrl = process.env.AFRO_CALLBACK_URL; // optional

    console.log('[SMS] Configuration check:', {
      hasApiKey: !!apiKey,
      hasSenderName: !!senderName,
      apiKeyLength: apiKey?.length || 0,
      senderName: senderName || 'NOT SET',
    });

    if (!apiKey || !senderName) {
      const missing = [!apiKey && 'AFRO_API_KEY', !senderName && 'AFRO_SENDER_NAME'].filter(Boolean);
      const errorMsg = `AfroMessage is not configured. Missing: ${missing.join(', ')}. Please set these environment variables in .env.local`;
      console.error('[SMS]', errorMsg);
      throw new Error(errorMsg);
    }

    // 2) Normalize to E.164 (+251...) with optional '+' stripping via AFRO_STRIP_PLUS
    const trimmed = to.trim();
    let digits = trimmed.replace(/\D/g, '');
    let e164 = trimmed;
    if (digits.length === 10 && digits.startsWith('09')) {
      e164 = `+251${digits.substring(1)}`;
    } else if (digits.length === 9 && digits.startsWith('9')) {
      e164 = `+251${digits}`;
    } else if (digits.startsWith('251') && digits.length === 12) {
      e164 = `+${digits}`;
    } else if (!trimmed.startsWith('+')) {
      e164 = `+${digits}`;
    }
    const stripPlus = (process.env.AFRO_STRIP_PLUS || '').toLowerCase() === 'true';
    const recipient = stripPlus && e164.startsWith('+') ? e164.substring(1) : e164;
    
    console.log('[SMS] Sending to:', {
      original: to,
      normalized: recipient,
      messageLength: body.length,
    });

    // 3) Endpoint - Use the standard AfroMessage API endpoint
    // Based on https://www.afromessage.com/developers
    const configuredBase = (process.env.AFRO_BASE_URL || '').trim();
    const defaultEndpoint = 'https://api.afromessage.com/api/send';
    // Reject clearly invalid endpoints (e.g., dashboard URL, malformed, or prefixed with '@')
    const isLikelyInvalid = !configuredBase || configuredBase.includes('dashboard') || configuredBase.startsWith('@');
    const endpoint = isLikelyInvalid ? defaultEndpoint : configuredBase;
    const timeoutMs = Number(process.env.AFRO_TIMEOUT_MS || 5000); // Reduced default to 5s
    const makeController = () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      return { controller, timeoutId };
    };
    const identifierId = process.env.AFRO_IDENTIFIER_ID;
    
    // Standard AfroMessage API payload format
    // Format: { from: identifier OR senderName, sender: senderName, to: phone, message: text }
    // If identifier is provided, use it in 'from', otherwise use senderName
    const payload: Record<string, unknown> = {
      from: identifierId || senderName,
      sender: senderName,
      to: recipient,
      message: body,
      ...(callbackUrl ? { callback: callbackUrl } : {}),
    };

    // 4) Helper to send and parse - SINGLE ATTEMPT ONLY
    const sendOnce = async (payloadData: Record<string, unknown>) => {
      const { controller, timeoutId } = makeController();
      try {
        console.log('[SMS] Making API request to:', endpoint);
        console.log('[SMS] Request payload:', JSON.stringify(payloadData, null, 2));
        console.log('[SMS] Authorization header:', `Bearer ${apiKey?.substring(0, 20)}...`);
        
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payloadData),
          signal: controller.signal,
        });
        
        const text = await resp.text();
        let data: any = {};
        try { 
          data = JSON.parse(text); 
        } catch (parseErr) {
          console.warn('[SMS] Response is not valid JSON:', text.substring(0, 200));
        }
        
        clearTimeout(timeoutId);
        return { resp, text, data } as const;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    // 5) SINGLE API CALL - Standard AfroMessage format only (no duplicates)

    // Add total timeout wrapper to prevent hanging indefinitely (20s max total)
    const totalTimeoutMs = 20000;
    let totalTimeoutId: NodeJS.Timeout | null = null;
    
    try {
      totalTimeoutId = setTimeout(() => {
        console.error('SMS sending exceeded total timeout (20s), aborting all attempts');
      }, totalTimeoutMs);

      // SINGLE API CALL ONLY - Using standard AfroMessage format
      // Format: { from: identifier|sender, sender: senderName, to: phone, message: text }
      try {
        console.log('[SMS] ════════════════════════════════════════');
        console.log('[SMS] Making SINGLE API call (no duplicates)');
        console.log('[SMS] Payload:', JSON.stringify(payload, null, 2));
        console.log('[SMS] Endpoint:', endpoint);
        console.log('[SMS] Using identifier:', identifierId || 'NO (using senderName)');
        console.log('[SMS] ════════════════════════════════════════');
        
        const { resp, text, data } = await sendOnce(payload);
        
        // Log FULL response for debugging
        console.log('[SMS] ════════════════════════════════════════');
        console.log('[SMS] API Response Received:');
        console.log('[SMS] Status Code:', resp.status, resp.statusText);
        console.log('[SMS] Response Headers:', JSON.stringify(Object.fromEntries(resp.headers.entries()), null, 2));
        console.log('[SMS] Full Response Body:', text);
        console.log('[SMS] Parsed JSON:', JSON.stringify(data, null, 2));
        console.log('[SMS] ════════════════════════════════════════');
        
        // Check HTTP status
        if (resp.status === 401 || resp.status === 403) {
          const errorMsg = `Authentication failed (${resp.status}). Check your AFRO_API_KEY.`;
          console.error(`[SMS] ❌ ${errorMsg}`);
          if (totalTimeoutId) clearTimeout(totalTimeoutId);
          return { success: false, error: errorMsg };
        }
        
        if (resp.status === 400) {
          const errorMsg = `Bad request (${resp.status}). Check payload format. Response: ${text.substring(0, 200)}`;
          console.error(`[SMS] ❌ ${errorMsg}`);
          if (totalTimeoutId) clearTimeout(totalTimeoutId);
          return { success: false, error: errorMsg };
        }
        
        // Check for success (2xx status)
        if (resp.ok && (resp.status >= 200 && resp.status < 300)) {
          // Check response body for actual success/failure
          const hasError = data?.error || data?.message?.toLowerCase().includes('error') || data?.response?.error;
          const successLike = data?.acknowledge === 'SUCCESS' 
            || data?.status === 'SUCCESS' 
            || data?.status?.toLowerCase().includes('success')
            || data?.status?.toLowerCase().includes('in progress')
            || data?.success === true;
          
          const messageId = data?.response?.messageid 
            || data?.messageId 
            || data?.id 
            || data?.message_id 
            || data?.response?.id
            || data?.data?.messageid;
          
          if (hasError && !successLike) {
            console.error(`[SMS] ❌ API returned 200 but contains error:`, hasError);
            console.error(`[SMS] Full response:`, JSON.stringify(data, null, 2));
            if (totalTimeoutId) clearTimeout(totalTimeoutId);
            return { success: false, error: `API error: ${JSON.stringify(hasError)}` };
          }
          
          // Success!
          console.log(`[SMS] ✅ API call successful - Status: ${resp.status}`);
          console.log(`[SMS] Message ID: ${messageId || 'n/a'}`);
          console.log(`[SMS] Response summary:`, {
            status: resp.status,
            messageId,
            acknowledge: data?.acknowledge,
            responseStatus: data?.status,
          });
          if (totalTimeoutId) clearTimeout(totalTimeoutId);
          return { success: true, messageId: messageId || 'sent' };
        }
        
        // Non-2xx status
        const errorMsg = `API returned status ${resp.status}: ${text.substring(0, 200)}`;
        console.error(`[SMS] ❌ ${errorMsg}`);
        if (totalTimeoutId) clearTimeout(totalTimeoutId);
        return { success: false, error: errorMsg };
        
      } catch (err) {
        const isAbort = (err as any)?.name === 'AbortError';
        const errorMsg = isAbort 
          ? `Request timeout after ${timeoutMs}ms` 
          : (err instanceof Error ? err.message : 'Unknown network error');
        console.error(`[SMS] ❌ Request failed:`, errorMsg);
        console.error(`[SMS] Error details:`, err instanceof Error ? err.stack : err);
        if (totalTimeoutId) clearTimeout(totalTimeoutId);
        return { success: false, error: errorMsg };
      }

    } finally {
      if (totalTimeoutId) clearTimeout(totalTimeoutId);
    }
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Generate SMS message for receipt voucher
 */
export function generateReceiptSMS(
  customerName: string,
  amount: number,
  ticketNumber: string,
  pdfLink?: string,
  reasonForPayment?: string | null
): string {
  let message = `Dear ${customerName}, your daily deposit of ETB ${amount.toFixed(2)}`;
  
  // Include reason for payment if provided
  if (reasonForPayment) {
    message += ` for ${reasonForPayment}`;
  }
  
  message += ` has been received by Gihon Saccos. Ticket No: ${ticketNumber}. Thank you for your payment!`;
  
  if (pdfLink) {
    return `${message} Receipt: ${pdfLink}`;
  }
  
  return message;
}

/**
 * Check if SMS service is configured
 */
export function isSMSConfigured(): boolean {
  const hasApiKey = !!process.env.AFRO_API_KEY;
  const hasSenderName = !!process.env.AFRO_SENDER_NAME;
  // Identifier is optional in the simplified flow
  const hasIdentifierId = !!process.env.AFRO_IDENTIFIER_ID;
  const isConfigured = hasApiKey && hasSenderName;
  
  if (!isConfigured) {
    console.warn('[SMS] Not configured:', {
      hasApiKey,
      hasSenderName,
      hasIdentifierId,
      missing: [
        !hasApiKey && 'AFRO_API_KEY',
        !hasSenderName && 'AFRO_SENDER_NAME',
      ].filter(Boolean),
    });
  }
  
  return isConfigured; // identifier optional
}
