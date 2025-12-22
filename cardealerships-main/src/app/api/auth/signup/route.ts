import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const { email, password, fullName, companyName, twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = await request.json();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    // 2. Create tenant (bypass RLS with admin client)
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({ name: companyName })
      .select()
      .single();

    if (tenantError || !tenantData) {
      // Clean up auth user if tenant creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: `Failed to create tenant: ${tenantError?.message}` }, { status: 400 });
    }

    // 3. Create user profile (bypass RLS with admin client)
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        tenant_id: tenantData.id,
        role: 'owner',
      });

    if (profileError) {
      // Clean up tenant and auth user if profile creation fails
      await supabaseAdmin.from('tenants').delete().eq('id', tenantData.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 400 });
    }

    // 4. Create dealership
    const { data: dealershipData, error: dealershipError } = await supabaseAdmin
      .from('dealerships')
      .insert({
        tenant_id: tenantData.id,
        name: companyName,
        phone_e164: twilioPhoneNumber || null,
      })
      .select()
      .single();

    if (dealershipError) {
      console.error('Failed to create dealership:', dealershipError);
      // Don't fail signup if dealership creation fails, can be added later
    }

    // 5. Store Twilio credentials if provided
    if (twilioAccountSid && twilioAuthToken && dealershipData) {
      const { error: twilioError } = await supabaseAdmin
        .from('twilio_credentials')
        .insert({
          tenant_id: tenantData.id,
          account_sid: twilioAccountSid,
          auth_token: twilioAuthToken,
          secret_ref: `twilio/${tenantData.id}`,
        });

      if (twilioError) {
        console.error('Failed to store Twilio credentials:', twilioError);
      }

      // 6. Add phone number if provided
      if (twilioPhoneNumber && dealershipData) {
        await supabaseAdmin.from('phone_numbers').insert({
          tenant_id: tenantData.id,
          dealership_id: dealershipData.id,
          phone_e164: twilioPhoneNumber,
          webhook_set: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during signup' }, { status: 500 });
  }
}
