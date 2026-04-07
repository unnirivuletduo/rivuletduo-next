import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  enquiryType: 'project' | 'general';
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  services?: string[];
  budget?: string;
  projectDescription?: string;
  message?: string;
};

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
}

function getWordPressRootApiUrl() {
  const base = (process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '').replace(/\/$/, '');
  if (!base) return '';
  return base.endsWith('/wp/v2') ? base.slice(0, -6) : base;
}

export async function POST(request: NextRequest) {
  const raw = (await request.json().catch(() => null)) as Partial<ContactPayload> | null;
  if (!raw) {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const enquiryType = raw.enquiryType === 'project' ? 'project' : raw.enquiryType === 'general' ? 'general' : null;
  if (!enquiryType) {
    return NextResponse.json({ message: 'Invalid enquiry type.' }, { status: 400 });
  }

  const email = asString(raw.email);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    return NextResponse.json({ message: 'Please enter a valid email.' }, { status: 400 });
  }

  const payload: ContactPayload = {
    enquiryType,
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    name: asString(raw.name),
    email,
    phone: asString(raw.phone),
    services: asStringArray(raw.services),
    budget: asString(raw.budget),
    projectDescription: asString(raw.projectDescription),
    message: asString(raw.message),
  };

  if (enquiryType === 'project') {
    if (!payload.firstName || !payload.lastName || !payload.projectDescription) {
      return NextResponse.json({ message: 'Please fill all required project fields.' }, { status: 400 });
    }
  } else if (!payload.name || !payload.message) {
    return NextResponse.json({ message: 'Please fill all required general enquiry fields.' }, { status: 400 });
  }

  const wpRoot = getWordPressRootApiUrl();
  if (!wpRoot) {
    return NextResponse.json({ message: 'WordPress API URL is not configured.' }, { status: 500 });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (process.env.RIVULET_CONTACT_SECRET) {
    headers['x-rivulet-contact-secret'] = process.env.RIVULET_CONTACT_SECRET;
  }

  try {
    const response = await fetch(`${wpRoot}/rivulet/v1/contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = typeof data?.message === 'string' ? data.message : 'Unable to submit the form right now.';
      return NextResponse.json({ message }, { status: response.status });
    }

    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ message: 'Unable to reach WordPress backend.' }, { status: 502 });
  }
}
