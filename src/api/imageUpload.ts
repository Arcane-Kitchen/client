import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: File, bucket: string, path: string): Promise<string> => {
  const uniquePath = `${path}-${uuidv4()}`; // Generate a unique filename

  const { data, error } = await supabase.storage.from(bucket).upload(uniquePath, file);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get the public URL of the uploaded image
  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path).data;

  if (!publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return publicUrl;
};