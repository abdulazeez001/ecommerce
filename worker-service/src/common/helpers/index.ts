import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { promisify } from 'util';

export const convertToYYYYMMDD = (isoDate: string) => {
  const date = moment(isoDate);
  return date.format('YYYY-MM-DD');
};

export const compareNames = (id_name: string, name: string) => {
  const normalized_id_name = id_name.trim().toLowerCase();
  const normalized_name = name.trim().toLowerCase();
  return normalized_id_name === normalized_name;
};

export const writeBufferToFile = async (
  buffer: Buffer,
  filename: string,
  directory: string,
): Promise<string> => {
  const writeFileAsync = promisify(fs.writeFile);
  // Ensure the directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Generate full file path
  const filePath = path.join(directory, filename);

  try {
    // Write the buffer to the file
    await writeFileAsync(filePath, buffer);
    return filePath; // Return the path of the saved file
  } catch (error) {
    throw new Error(`Failed to write buffer to file: ${error.message}`);
  }
};

export const getFileBufferFromUrl = async (
  fileUrl: string,
): Promise<string> => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer', // Ensures the response is returned as a Buffer
    });

    const base64String = Buffer.from(response.data).toString('base64');

    return base64String;
  } catch (error) {
    throw new Error(`Failed to download file from URL: ${error.message}`);
  }
};
