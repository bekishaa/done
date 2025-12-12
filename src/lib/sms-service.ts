/**
 * SMS Service for sending notifications using BasicSMS API
 * Real implementation using BasicSMS provider
 */

export interface SMSMessage {
  to: string;
  message: string;
  ticketNumber?: string;
  customerName?: string;
  amount?: number;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface BasicSMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Real SMS service using BasicSMS API
 */
export class SMSService {
  private static instance: SMSService;
  private apiKey: string;
  private identifierId: string;
  private senderName: string;
  private baseUrl: string;

  private constructor() {
    // BasicSMS API credentials
    this.apiKey = process.env.SMS_API_KEY || "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiQlM0eGN3OXJ5cXhienpiT0dMWEJzY2lUdnBUd29aZU4iLCJleHAiOjE5MTc2ODE1NjQsImlhdCI6MTc1OTkxNTE2NCwianRpIjoiYjFkZGE5NjUtMGIxZS00ZGJjLWJiYWItNTgyZjU0MmViOTI0In0.cA9NBaaD_xBcz9FgSg648VPCnJmo_BcUnB8hRRv-KnU";
    this.identifierId = process.env.SMS_IDENTIFIER_ID || "e80ad9d8-adf3-463f-80f4-7c4b39f7f164";
    this.senderName = process.env.SMS_SENDER_NAME || "GihonSaccos";
    this.baseUrl = "https://api.basicsms.com";
  }

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  /**
   * Send SMS notification for ticket generation using BasicSMS API
   */
  public async sendTicketNotification(smsData: SMSMessage): Promise<SMSResponse> {
    try {
      // Validate phone number format
      const isValidPhone = this.validatePhoneNumber(smsData.to);
      
      if (!isValidPhone) {
        return {
          success: false,
          error: "Invalid phone number format"
        };
      }

      // Format phone number for API
      const formattedPhone = this.formatPhoneNumber(smsData.to);

      // Prepare API request
      const requestBody = {
        to: formattedPhone,
        message: smsData.message,
        from: this.senderName
      };

      console.log('Sending SMS via BasicSMS API:', {
        to: formattedPhone,
        message: smsData.message,
        from: this.senderName
      });

      // Make API call to BasicSMS
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BasicSMS API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        return {
          success: false,
          error: `SMS API error: ${response.status} ${response.statusText}`
        };
      }

      const result: BasicSMSResponse = await response.json();
      
      if (result.success) {
        console.log(`SMS sent successfully via BasicSMS:`, {
          to: formattedPhone,
          message: smsData.message,
          messageId: result.messageId
        });

        return {
          success: true,
          messageId: result.messageId
        };
      } else {
        console.error('BasicSMS API returned error:', result);
        return {
          success: false,
          error: result.error || "Unknown error from SMS API"
        };
      }
    } catch (error) {
      console.error("SMS sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  /**
   * Generate SMS message for ticket notification with link
   */
  public generateTicketMessage(data: {
    customerName: string;
    ticketNumber: string;
    amount: number;
    reason: string;
    date: string;
    ticketLink?: string;
  }): string {
    if (data.ticketLink) {
      return `Dear Customer, your daily deposit of ${data.amount.toFixed(2)} ETB by ${data.reason} has been received. Thank you for using GIHON SACCOS. View receipt: ${data.ticketLink}`;
    }
    
    return `Dear ${data.customerName}, your daily deposit of ${data.amount.toFixed(2)} ETB by ${data.reason} has been received. Thank you for using GIHON SACCOS.`;
  }

  /**
   * Validate phone number format (Ethiopian format)
   */
  private validatePhoneNumber(phone: string): boolean {
    // Ethiopian phone number validation
    const ethiopianPhoneRegex = /^(\+251|0)?9[0-9]{8}$/;
    return ethiopianPhoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Format phone number for SMS sending
   */
  public formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Convert to international format if needed
    if (cleaned.startsWith('0')) {
      return '+251' + cleaned.substring(1);
    } else if (cleaned.startsWith('9')) {
      return '+251' + cleaned;
    } else if (cleaned.startsWith('251')) {
      return '+' + cleaned;
    }
    
    return '+' + cleaned;
  }
}

/**
 * Utility function to send ticket notification SMS
 */
export async function sendTicketSMS(data: {
  customerName: string;
  phoneNumber: string;
  ticketNumber: string;
  amount: number;
  reason: string;
  date: string;
  ticketLink?: string;
}): Promise<SMSResponse> {
  const smsService = SMSService.getInstance();
  
  const message = smsService.generateTicketMessage({
    customerName: data.customerName,
    ticketNumber: data.ticketNumber,
    amount: data.amount,
    reason: data.reason,
    date: data.date,
    ticketLink: data.ticketLink
  });

  const formattedPhone = smsService.formatPhoneNumber(data.phoneNumber);

  return await smsService.sendTicketNotification({
    to: formattedPhone,
    message,
    ticketNumber: data.ticketNumber,
    customerName: data.customerName,
    amount: data.amount
  });
}
