'use client';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getApp } from 'firebase/app';

/**
 * Uploads a profile picture for a user to Firebase Storage.
 *
 * @param userId - The ID of the user.
 * @param file - The image file to upload.
 * @param onProgress - A callback function to track the upload progress (0-100).
 * @returns A promise that resolves with the public URL of the uploaded image.
 */
export const uploadProfilePicture = (
  userId: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const app = getApp();
    const storage = getStorage(app);
    
    // Create a storage reference
    const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);

    // Create an upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register observers to listen for state changes
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed:', error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
