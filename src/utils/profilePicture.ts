const CDNURL =
  "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

export function resolveProfileImageUrl(
  profilePicture?: string | null,
  userId?: string | null
): string | null {
  if (!profilePicture) return null;
  if (/^https?:\/\//i.test(profilePicture)) return profilePicture;
  if (!userId) return null;
  return `${CDNURL}${userId}/${profilePicture}`;
}
