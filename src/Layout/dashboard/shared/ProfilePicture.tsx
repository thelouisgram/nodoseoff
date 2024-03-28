import React, { useEffect, useState } from 'react';

function useProfilePicture(url) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            // Add any necessary headers here, such as authorization tokens
          },
        });

        if (response.ok) {
          // Convert the response to blob (binary data)
          const blob = await response.blob();
          
          // Create an object URL from the blob
          const imageUrl = URL.createObjectURL(blob);

          setImageUrl(imageUrl);
        } else {
          console.error('Error fetching profile picture:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    }

    fetchProfilePicture();

    // Clean up the object URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [url]); // Dependency array with url ensures useEffect runs when url changes

  return imageUrl;
}

// Example usage:
function ProfilePicture({ url }) {
  const imageUrl = useProfilePicture(url);

  if (!imageUrl) {
    return <div>Loading...</div>;
  }

  return <Image src={imageUrl} alt="Profile" />;
}

// Usage:
<ProfilePicture url="https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/1627af88-c2a6-4f03-8715-ad295b971e8e/avatar.png" />;
