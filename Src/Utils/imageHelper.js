/**
 * Resolves a profile_image value from the API into a usable URI string.
 *
 * Django REST Framework with ImageField + MEDIA settings returns a full URL,
 * e.g. "http://127.0.0.1:8000/media/profiles/photo.png".
 * On an Android emulator, 127.0.0.1 must be replaced with 10.0.2.2.
 * On a real device, replace with your machine's LAN IP (e.g. 192.168.x.x).
 */
import { IMAGE_BASE_URL } from '../Config/BaseUrl';

export const resolveImageUrl = (profileImage) => {
  if (!profileImage) return null;

  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
    // Full URL from DRF — fix localhost → emulator-reachable address
    return profileImage
      .replace('http://127.0.0.1', 'http://10.0.2.2')
      .replace('http://localhost',  'http://10.0.2.2');
  }

  // Relative path like "profiles/photo.png" — prepend media base
  return `${IMAGE_BASE_URL}${profileImage}`;
};
