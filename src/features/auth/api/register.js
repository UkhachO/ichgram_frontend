
import client from '../../../shared/api/client';

export async function registerUser(payload) {

  const { data } = await client.post('/auth/register', payload);
  return data; 
}
