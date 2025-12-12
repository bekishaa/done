import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'profile'; // 'profile' or 'stamp'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine upload directory and filename
    let uploadDir: string;
    let filename: string;

    if (type === 'stamp') {
      uploadDir = path.join(process.cwd(), 'public');
      filename = 'stamp.png';
    } else {
      // For profile images, store in public/uploads/profile
      uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile');
      filename = `${Date.now()}-${file.name}`;
    }

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the URL path
    const url = type === 'stamp' 
      ? '/stamp.png' 
      : `/uploads/profile/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

