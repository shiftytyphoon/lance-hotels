import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  const body = JSON.parse(event.body || '{}');

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      message: 'Tool router placeholder is working',
      received: body
    })
  };
};
