import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createOrganization, addUserToOrganization, getUserOrganizations } from '@/lib/auth';

// Define the schema for creating an organization
const createOrgSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().optional(),
  logo: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate the input
    const validationResult = createOrgSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation failed',
        issues: validationResult.error.issues
      }, { status: 400 });
    }

    const { name, industry, logo } = validationResult.data;

    // Create the organization
    const newOrg = createOrganization(name, industry, logo);

    if (!newOrg) {
      return NextResponse.json({
        error: 'Failed to create organization'
      }, { status: 500 });
    }

    // Add the current user as owner
    const success = addUserToOrganization(session.user.id, newOrg.id, 'owner');

    if (!success) {
      return NextResponse.json({
        error: 'Failed to add user to organization'
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Organization created successfully',
      organization: { id: newOrg.id, name, industry, logo }
    }, { status: 201 });
  } catch (error) {
    console.error('Create organization error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizations = getUserOrganizations(session.user.id);

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Get organizations error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
