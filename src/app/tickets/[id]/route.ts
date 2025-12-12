import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Route handler to serve ticket HTML
 * URL format: /tickets/{ticketId}.pdf
 * 
 * Note: Next.js will match /tickets/{id}.pdf to this route
 * The [id] param will contain the full segment including .pdf, so we strip it
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params;
    
    // The id param will be something like "clx123abc.pdf" - strip the extension
    let ticketId = String(resolvedParams.id);
    if (ticketId.endsWith('.pdf')) {
      ticketId = ticketId.slice(0, -4); // Remove .pdf
    }
    
    console.log('[Ticket Route] Request received:', {
      ticketId,
      url: request.url,
      pathname: request.nextUrl.pathname,
    });
    
    // Fetch ticket from database
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        ticketNumber: true,
        htmlContent: true,
        customerName: true,
      },
    });

    console.log('[Ticket Route] Ticket lookup result:', {
      found: !!ticket,
      hasHtml: !!ticket?.htmlContent,
      ticketNumber: ticket?.ticketNumber,
      htmlLength: ticket?.htmlContent?.length || 0,
    });

    if (!ticket) {
      console.error('[Ticket Route] Ticket not found for ID:', ticketId);
      return new NextResponse('Ticket not found', { status: 404 });
    }

    // If ticket has stored HTML, serve it
    if (ticket.htmlContent) {
      console.log('[Ticket Route] Serving HTML for ticket:', ticket.ticketNumber);
      return new NextResponse(ticket.htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          // Add headers to help browsers display/print as PDF
          'Content-Disposition': `inline; filename="ticket-${ticket.ticketNumber}.html"`,
        },
      });
    }

    // If no HTML stored, return error
    console.error('[Ticket Route] No HTML content for ticket:', ticket.ticketNumber);
    return new NextResponse('Ticket HTML not available', { status: 404 });
  } catch (error) {
    console.error('[Ticket Route] Error serving ticket:', error);
    if (error instanceof Error) {
      console.error('[Ticket Route] Error stack:', error.stack);
    }
    return new NextResponse(`Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

