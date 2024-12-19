import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

async function saveBase64AsJpg(
  base64String: string,
  firstName: string,
  lastName: string
): Promise<string> {
  const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
  
  const fileName = [firstName, lastName].join('_').toLowerCase() + uuidv4().slice(0, 8);

  const outputFilePath = path.join(__dirname, 'public', `${fileName}.jpg`);

  await fs.promises.writeFile(outputFilePath, base64Data, 'base64');

  console.log(`File successfull saved as ${fileName}.jpg`);

  return `${fileName}.jpg`;
}

export default saveBase64AsJpg;
