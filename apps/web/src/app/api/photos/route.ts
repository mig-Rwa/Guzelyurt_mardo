import { NextRequest } from 'next/server';
import { CustomerPhotoCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/server/mockDb';
import { fail, forbidden, getRequestContext, ok, parseBooleanParam } from '@/lib/server/api';

type PhotoStatus = 'pending' | 'approved' | 'rejected';

export async function POST(request: NextRequest) {
  try {
    const ctx = getRequestContext(request);
    const formData = await request.formData();
    
    const orderId = formData.get('orderId') as string;
    const customerName = formData.get('customerName') as string;
    const caption = formData.get('caption') as string | null;
    const imageFile = formData.get('image') as File;
    
    if (!orderId || !customerName || !imageFile) {
      return fail('Missing required fields', 400);
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return fail('Invalid file type. Only JPEG, PNG, and WebP are allowed.', 400);
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return fail('File too large. Maximum size is 5MB.', 400);
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
      userId: ctx.userId,
      customerName,
      imageUrl,
      caption: caption || undefined,
      status: 'pending' as PhotoStatus,
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
      return fail('Invalid photo data', 400);
    }
    
    // In production: await adminDb.collection('customerPhotos').add(photo);
    db.photos.push(photo);
    
    return ok(photo, { status: 201 });
  } catch (error) {
    console.error('Photo upload error:', error);
    return fail('Failed to upload photo', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const ctx = getRequestContext(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = parseBooleanParam(searchParams.get('featured'));
    const includeAll = parseBooleanParam(searchParams.get('all'));
    const userOnly = parseBooleanParam(searchParams.get('mine'));
    
    let filteredPhotos = [...db.photos];

    // Public requests only see approved photos.
    if (!ctx.isModerator && !status && !includeAll && !userOnly) {
      filteredPhotos = filteredPhotos.filter((p) => p.status === 'approved');
    }

    if (status) {
      filteredPhotos = filteredPhotos.filter((p) => p.status === status);
    }

    if (userOnly) {
      filteredPhotos = filteredPhotos.filter((p) => p.userId === ctx.userId);
    }

    if (includeAll && !ctx.isModerator) {
      filteredPhotos = filteredPhotos.filter((p) => p.status === 'approved');
    }
    
    if (featured) {
      filteredPhotos = filteredPhotos.filter((p) => p.isFeatured);
    }
    
    // Sort by uploadedAt descending
    filteredPhotos.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    return ok(filteredPhotos, { meta: { total: filteredPhotos.length } });
  } catch (error) {
    console.error('Fetch photos error:', error);
    return fail('Failed to fetch photos', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isModerator) {
    return forbidden();
  }

  try {
    const body = await request.json();
    const photoId = body?.id as string | undefined;
    const status = body?.status as PhotoStatus | undefined;
    const isFeatured = body?.isFeatured as boolean | undefined;

    if (!photoId) {
      return fail('Photo id is required', 400);
    }

    const existing = db.photos.find((p) => p.id === photoId);
    if (!existing) {
      return fail('Photo not found', 404);
    }

    if (status) {
      const allowed: PhotoStatus[] = ['pending', 'approved', 'rejected'];
      if (!allowed.includes(status)) {
        return fail('Invalid status', 400);
      }
      existing.status = status;
    }

    if (typeof isFeatured === 'boolean') {
      existing.isFeatured = isFeatured;
    }

    return ok(existing);
  } catch (error) {
    console.error('Photo update error:', error);
    return fail('Failed to update photo', 500);
  }
}
