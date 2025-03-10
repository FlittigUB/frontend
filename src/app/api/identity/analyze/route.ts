// app/api/identity/analyze/route.ts

import { NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const idCard = formData.get('id_card');

    // Validate the id_card file
    if (
      !idCard ||
      typeof idCard === 'string' || // It shouldn't be a string
      !('stream' in idCard) ||      // Ensure it has a stream method
      !('name' in idCard) ||        // Ensure it has a name
      !('type' in idCard)           // Ensure it has a type
    ) {
      return NextResponse.json(
        { message: '"id_card" file is required and must be a valid file' },
        { status: 400 }
      );
    }

    // Prepare form data to send to the backend
    const backendFormData = new FormData();
    backendFormData.append('id_card', idCard as Blob, (idCard as any).name);

    // Extract the Authorization header from the incoming request
    const authHeader = req.headers.get('Authorization');

    // Forward the request to the backend with the Authorization header
    const backendResponse = await fetch(`${process.env.API_URL}/identity/analyze`, {
      method: 'POST',
      headers: {
        // Forward the Authorization header if it exists
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        // 'Content-Type' is automatically set when using FormData
      },
      body: backendFormData,
    });

    // Check if the backend response is not OK
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const responseData = await backendResponse.json();

    return NextResponse.json(responseData, { status: backendResponse.status });
  } catch (error: any) {
    console.error('Error processing the image:', error);
    return NextResponse.json(
      { message: 'Error processing the image' },
      { status: 500 }
    );
  }
}
