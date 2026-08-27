const fs = require('fs');
const { DocumentProcessorServiceClient } =
  require('@google-cloud/documentai').v1;

const PROJECT_ID = "sturdy-tine-451308-q2";
const LOCATION = 'us';
const PROCESSOR_ID = "6fca68b1daae3e38";

const FILE_PATH = './passport2.jpg';

async function extractPassport() {
  const client = new DocumentProcessorServiceClient({
    apiEndpoint: `${LOCATION}-documentai.googleapis.com`,
  });

  const processorName =
    `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;

  const imageContent = fs.readFileSync(FILE_PATH);

  const request = {
    name: processorName,

    rawDocument: {
      content: imageContent,
      mimeType: 'image/jpeg',
    },
  };

  const [result] = await client.processDocument(request);

  const document = result.document;

  console.log('\n========== RAW TEXT ==========\n');
  console.log(document.text);

  console.log('\n========== ENTITIES ==========\n');

  for (const entity of document.entities || []) {
    console.log({
      type: entity.type,
      value: entity.textAnchor?.content || '',
      confidence: entity.confidence,
    });
  }
}

extractPassport().catch(console.error);