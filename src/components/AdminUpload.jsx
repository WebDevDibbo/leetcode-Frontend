import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient'

const AdminUpload = () => {
    const {problemId } =  useParams();

    const [uploading, setUploading] = useState(false);
    const [uploadVideoProgress, setUploadVideoProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [uploadThumbProgress, setUploadThumbProgress] = useState(0);
    
      const {register, handleSubmit, watch, formState: { errors }, reset, setError, clearErrors} = useForm();
    
      // const selectedFile = watch('videoFile')?.[0];
      const videoSelectedFile = watch('videoFile')?.[0];
      const imageSelectedFile = watch('imageFile')?.[0];

    
      // Upload video to Cloudinary
      const onSubmit = async (data) => {
        
        // const file = data.videoFile[0];
        const videoFile = data.videoFile[0];
        const imgFile = data.imageFile[0];
        
        setUploading(true);
        setUploadVideoProgress(0);
        setUploadThumbProgress(0);
        clearErrors();
    
        try {

          //1️⃣ Step 1: Get upload signature from backend
          const signatureResponse = await axiosClient.get(`/api/video/create/${problemId}`);
          // const { signature, timestamp, public_id, api_key, upload_url } = signatureResponse.data;
          const {video, thumbnail} = signatureResponse.data;
          console.log('video',video);
          console.log('thumbnail',thumbnail);
    
          //2️⃣ Step 2: Create videoform for Cloudinary upload
          const VideoFormData = new FormData();
          VideoFormData.append('file', videoFile);
          VideoFormData.append('signature', video.signature);
          VideoFormData.append('timestamp', video.timestamp);
          VideoFormData.append('public_id', video.public_id);
          VideoFormData.append('api_key', video.api_key);
          

          const ImageFormData = new FormData();
          ImageFormData.append('file',imgFile);
          ImageFormData.append('signature', thumbnail.signature)
          ImageFormData.append('timestamp', thumbnail.timestamp)
          ImageFormData.append('public_id', thumbnail.public_id)
          ImageFormData.append('api_key', thumbnail.api_key)
          

    
          //3️⃣ Step 3: Upload Video directly to Cloudinary because i have to upload two things i can upload concurrently
          const [uploadVideoResponse, uploadThumbResponse] = await Promise.all([
            axios.post(video.upload_url, VideoFormData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (e) =>
                setUploadVideoProgress(Math.round((e.loaded * 100) / e.total)),
            }),
            axios.post(thumbnail.upload_url, ImageFormData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (e) =>
                setUploadThumbProgress(Math.round((e.loaded * 100) / e.total)),
            }),
          ]);
          
          // const uploadResponse = await axios.post(video.upload_url, VideoFormData, {
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          //   onUploadProgress: (progressEvent) => {
          //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          //     setUploadVideoProgress(progress);
          //   },
          // });

          // const uploadThumbResponse = await axios.post(imgFile.upload_url, ImageFormData, {
          //   headers : {
          //     'Content-Type' : 'multipart/form-data'
          //   },
          //   onUploadProgress : (progressEvent) => {
          //     const imgprogress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          //     setUploadThumbProgress(imgprogress);
          //   }
          // })
    
          // const cloudinaryResult = uploadResponse.data;
          // console.log('clll',uploadResponse);
          // console.log('cloudinary',uploadResponse.data);
          const videoResult = uploadVideoResponse.data;
          const thumbResult = uploadThumbResponse.data;
          
        
          const result = await axiosClient.post('/api/video/save',{
            problemId: problemId,
            videoPublicId : videoResult.public_id,
            videoSecureUrl : videoResult.secure_url,
            duration : videoResult.duration,
            thumbnailPublicId : thumbResult.public_id,
            thumbnailSecureUrl : thumbResult.secure_url
          })
          setUploadedVideo(result.data.videoSolution);
    
          reset()
        } catch (err) {
          console.log('Upload error:', err);
          setError('root', [{
            type: 'manual',
            message: err.response?.data?.error 
          }]);
        } finally {
          setUploading(false);
          // setUploadVideoProgress(0);
          // setUploadThumbProgress(0);
        }
      };
    
      // Format file size
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
    
      // Format duration
      const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
    
      return (
        <div className="max-w-md mx-auto p-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Upload Video</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* File Input */}
                <div className="form-control w-full">
                  <div>
                  <label className="label mb-2">
                    <span className="label-text">Choose video file</span>
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return 'Please select a video file';
                          const file = files[0];
                          return file.type.startsWith('video/') || 'Please select a valid video file';
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          const file = files[0];
                          const maxSize = 100 * 1024 * 1024; // 100MB
                          return file.size <= maxSize || 'File size must be less than 100MB';
                        }
                      }
                    })}
                    className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
                    disabled={uploading}
                  />
                  {errors.videoFile && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.videoFile.message}</span>
                    </label>
                  )}
                  {/* Selected Video File Info */}
                {videoSelectedFile && (
                  <div className="alert alert-info mt-2">
                    <div>
                      <h3 className="font-bold">Selected File:</h3>
                      <p className="text-sm">{videoSelectedFile.name}</p>
                      <p className="text-sm">Size: {formatFileSize(videoSelectedFile.size)}</p>
                    </div>
                  </div>
                )}
                {/* Upload video Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadVideoProgress}%</span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={uploadVideoProgress} 
                      max="100"
                    ></progress>
                  </div>
                )}
                
                </div>
                <div>
                  <label className="label mt-4 mb-2">
                    <span className="label-text">Choose Your Thumbnail</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('imageFile', {
                      required: 'Please select a thumbnail image',
                      validate: {
                        isImage: (files) => {
                          return files && files[0] && files[0].type.startsWith("image/") ? true : "Only image files are allowed"
                          // if (!files || !files[0]) return 'Please select a video file';
                          // const file = files[0];
                          // return file.type.startsWith('video/') || 'Please select a valid video file';
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          const file = files[0];
                          const maxSize = 100 * 1024 * 1024; // 100MB
                          return file.size <= maxSize || 'File size must be less than 100MB';
                        }
                      }
                    })}
                    className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
                    disabled={uploading}
                  />
                  {errors.imageFile && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.imageFile.message}</span>
                    </label>
                  )}
                  {/* Selected Thumbnail File Info */}
                  {imageSelectedFile && (
                  <div className="alert alert-info mt-2">
                    <div>
                      <h3 className="font-bold">Selected File:</h3>
                      <p className="text-sm">{imageSelectedFile.name}</p>
                      <p className="text-sm">Size: {formatFileSize(imageSelectedFile.size)}</p>
                    </div>
                  </div>
                )}
                {/* Upload image Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadThumbProgress}%</span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={uploadThumbProgress} 
                      max="100"
                    ></progress>
                  </div>
                )}
                  </div>
                </div>

                {/* Success Message */}
                {uploadedVideo && (
                  <div className="alert alert-success mt-2">
                    <div>
                      <h3 className="font-bold">Upload Successful!</h3>
                      <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
                      <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
    
                {/* Error Message */}
                {errors.root && (
                  <div className="alert alert-error">
                    <span>{errors.root[0].message}</span>
                  </div>
                )}
    
                
    
                {/* Upload Button */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`btn btn-primary ${uploading ? 'loading' : ''}`}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            
            </div>
          </div>
        </div>
    );
};

export default AdminUpload;







