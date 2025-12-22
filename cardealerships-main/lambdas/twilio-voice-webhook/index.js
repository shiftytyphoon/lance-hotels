export const handler = async (event) => {
  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString()
    : event.body;

  const params = new URLSearchParams(body);
  const callSid = params.get('CallSid');
  const from = params.get('From');
  const to = params.get('To');

  const sessionUrl = 'wss://session.lance.live/twilio';

  const twiml = `
<Response>
  <Connect>
    <Stream url="${sessionUrl}">
      <Parameter name="callSid" value="${callSid}" />
      <Parameter name="from" value="${from}" />
      <Parameter name="to" value="${to}" />
    </Stream>
  </Connect>
</Response>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: twiml,
  };
};
