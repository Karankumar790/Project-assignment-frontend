import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/features/cropImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import Course from "./Course";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

   const { data, isLoading, refetch } = useLoadUserQuery(undefined, {
  refetchOnMountOrArgChange: true,
});
  const [updateUser, { isLoading: updateUserIsLoading, isSuccess, isError, error }] = useUpdateUserMutation();
  const user = data?.user;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPreviewImage(user.photoUrl || null);
    }
  }, [user]);

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const updateUserHandler = async () => {
    let croppedImageBlob;
    if (imageSrc && croppedAreaPixels) {
      croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    }

    const formData = new FormData();
    formData.append("name", name || user?.name || "");
    if (croppedImageBlob) {
      formData.append("profilePhoto", croppedImageBlob, "cropped.jpeg");
    }

    await updateUser(formData);
    setEditMode(false);
    setImageSrc(null);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("🎉 Profile updated successfully!");
    }
    if (isError) {
      toast.error(error?.message || "❌ Failed to update profile.");
    }
  }, [isSuccess, isError]);

  if (isLoading || !user) {
    return (
      <h1 className="text-center mt-20 text-xl animate-pulse">Loading your profile...</h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 my-24">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md"
      >
        My Profile
      </motion.h1>

      <motion.div
        className="mt-10 p-8 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl flex flex-col md:flex-row items-center gap-10 hover:shadow-purple-400/30 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="relative group">
          <Avatar className="h-36 w-36 ring-4 ring-purple-500 transition-transform duration-300 group-hover:scale-110">
            <AvatarImage
              src={previewImage || "https://github.com/shadcn.png"}
              alt="user avatar"
              className="object-cover h-full w-full"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {editMode && (
            <div className="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-md group-hover:scale-105 transition">
              <Pencil size={20} className="text-purple-500" />
            </div>
          )}
        </div>

        <div className="w-full text-gray-700 dark:text-gray-300">
          {!editMode ? (
            <>
              <p className="text-lg font-semibold">
                👤 Name: <span className="text-xl font-bold text-black dark:text-white">{user?.name || "N/A"}</span>
              </p>
              <p className="text-lg mt-2">
                📧 Email: <span className="font-medium">{user?.email || "N/A"}</span>
              </p>
              <p className="text-lg mt-2">
                🎓 Role: <span className="uppercase font-semibold text-blue-600 dark:text-blue-400">{user?.role || "N/A"}</span>
              </p>
              <Button
                onClick={() => setEditMode(true)}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-xl"
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <div className="grid gap-5 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-sm">Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-sm">Profile Photo</Label>
                <Input
                  onChange={onImageChange}
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                />
              </div>

              {imageSrc && (
                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
              )}

              <div className="flex gap-4 justify-end mt-6">
                <Button onClick={() => { setEditMode(false); setImageSrc(null); }} variant="ghost">
                  Cancel
                </Button>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:shadow-xl"
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          📚 Your Enrolled Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {user?.enrolledCourses?.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">You haven't enrolled in any courses yet.</p>
          ) : (
            user?.enrolledCourses?.map((course) => (
              <motion.div
                key={course._id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Course course={course} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      <BackButton />
    </div>
  );
};

export default Profile;
