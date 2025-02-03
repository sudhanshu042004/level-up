"use client"
import React, { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import * as Avatar from '@/components/ui/avatar';
import { Camera, Loader2, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ExpProgress from '@/components/ExpProgress';
import UpdateUserProfile from '@/lib/actions/users/UpdateUser';
import toast, { Toaster } from 'react-hot-toast';

const Settings = () => {
  const userContextData = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDisable, setIsDisable] = useState<boolean>(false);

  if (userContextData?.user == null || userContextData.maxExp == null) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const { user, maxExp, setUser } = userContextData;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisable(true);

    try {
      const newUser = {
        username: username || user.username,
        name: name || user.name,
      };

      if (!imageFile) {
        const res = await UpdateUserProfile(newUser, undefined);
        if (res === 400) {
          toast.error("Failed to update profile", { icon: '😔' });
        } else {
          toast.success("Profile updated successfully", { icon: '✨' });
        }
        setIsDisable(false);
        setIsEditing(false);
        return;
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filedata = buffer.toString("base64");

      const fileObject = {
        fileName: imageFile.name,
        fileType: imageFile.type,
        fileData: filedata
      };

      const url = await UpdateUserProfile(newUser, fileObject);

      if (url === 400) {
        toast.error("Failed to upload image", { icon: '😔' });
      } else {
        toast.success("Profile updated successfully", { icon: '✨' });
        const updatedUser = {
          ...user,
          name: newUser.name,
          username: newUser.username,
          avatar: url as string
        };
        setUser(updatedUser);
        setPreviewUrl(url as string);
      }
    } catch (error) {
      toast.error("An error occurred", { icon: '😔' });
    } finally {
      setIsDisable(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full lg:h-screen min-h-[80vh] px-4 py-8 bg-gradient-to-r from-red-50 to-yellow-50 md:py-12">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        <Card className=" border-0 bg-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            {/* Profile Header */}
            <div className="relative flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <ExpProgress
                  currentExp={user.exp as number}
                  className="transform transition-transform duration-300 hover:scale-105"
                  maxExp={maxExp}
                  size={144}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group">
                    <Avatar.Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-white shadow-lg transition-all duration-300 group-hover:shadow-xl">
                      <Avatar.AvatarImage
                        src={previewUrl || user.avatar}
                        alt={user.username}
                        className="object-cover"
                      />
                      <Avatar.AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 font-medium">
                        {user.username?.slice(0, 2).toUpperCase() || 'UN'}
                      </Avatar.AvatarFallback>
                    </Avatar.Avatar>
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Camera className="text-white h-6 w-6" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-1">
                  {user.name || 'Unnamed User'}
                </h2>
                <p className="text-sm text-slate-500">
                  {user.email}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 hover:bg-yellow-100"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> :
                  <span className="flex items-center gap-2">
                    Edit Profile
                  </span>
                }
              </Button>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Username</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={user.username || 'Enter username'}
                      className="w-full bg-white/70 border-blue-100 focus:ring-2 focus:ring-yellow-200"
                    />
                  ) : (
                    <div className="p-2.5 bg-white/70 rounded-lg border border-blue-100/50 text-slate-700">
                      {user.username}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Display Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={user.name || 'Enter display name'}
                      className="w-full bg-white/70 border-blue-100 focus:ring-1 focus:ring-[#ffe5b0]"
                    />
                  ) : (
                    <div className="p-2.5 bg-white/70 rounded-lg border border-blue-100/50 text-slate-700">
                      {user.name}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/70 hover:bg-yellow-100 border-blue-100"
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewUrl(null);
                      setUsername('');
                      setName('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isDisable}
                    className="bg-[#FEC300] transition-all duration-300 hover:bg-[#FEC300] hover:shadow-lg hover:-translate-y-1 text-white flex items-center gap-2"
                  >
                    {isDisable ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>

            {/* Level Information */}
            <div className="mt-8 pt-6 border-t border-blue-100">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-500 mb-1">Level</p>
                  <p className="text-xl font-semibold text-[#FEC300]">{user.level}</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-500 mb-1">Rank</p>
                  <p className="text-xl font-semibold text-[#fec300]">{user.rank}</p>
                </div>
                <div className="col-span-2 md:col-span-1 bg-white/60 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-500 mb-1">Experience</p>
                  <p className="text-xl font-semibold text-[#fec300]">
                    {user.exp} / {maxExp}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
