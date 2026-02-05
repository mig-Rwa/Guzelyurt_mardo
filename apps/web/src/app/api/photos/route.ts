import { NextRequest, NextResponse } from 'next/server';
import { CustomerPhotoCreateSchema } from '@shared/schemas';
import { v4 as uuidv4 } from 'uuid';

// In production, this would use Firebase Storage and Firestore
const photos: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const orderId = formData.get('orderId') as string;
    const customerName = formData.get('customerName') as string;
    const caption = formData.get('caption') as string | null;
    const imageFile = formData.get('image') as File;
    
    if (!orderId || !customerName || !imageFile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    // In production, upload to Firebase Storage
    // const storage = getStorage();
    // const storageRef = ref(storage, `customer-photos/${uuidv4()}-${imageFile.name}`);
    // const snapshot = await uploadBytes(storageRef, await imageFile.arrayBuffer());
    // const imageUrl = await getDownloadURL(snapshot.ref);
    
    // For now, create a mock URL
    const imageUrl = `https://placehold.co/800x600?text=Customer+Photo`;
    
    // Create photo record
    const photo = {
      id: uuidv4(),
      orderId,
      customerName,
      imageUrl,
      caption: caption || undefined,
      status: 'pending',
      isFeatured: false,
      uploadedAt: new Date().toISOString(),
      likes: 0,
    };
    
    // Validate schema
    const validationResult = CustomerPhotoCreateSchema.safeParse({
      orderId: photo.orderId,
      customerName: photo.customerName,
      imageUrl: photo.imageUrl,
      caption: photo.caption,
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid photo data' },
        { status: 400 }
      );
    }
    
    // In production: await adminDb.collection('customerPhotos').add(photo);
    photos.push(photo);
    
    return NextResponse.json({
      success: true,
      data: photo,
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';
    const featured = searchParams.get('featured') === 'true';
    
    // In production: query Firestore
    let filteredPhotos = photos.filter((p) => p.status === status);
    
    if (featured) {
      filteredPhotos = filteredPhotos.filter((p) => p.isFeatured);
    }
    
    // Sort by uploadedAt descending
    filteredPhotos.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    return NextResponse.json({
      success: true,
      data: filteredPhotos,
    });
  } catch (error) {
    console.error('Fetch photos error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
