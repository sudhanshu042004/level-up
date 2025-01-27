"use client"
import React, { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import * as Avatar from '@/components/ui/avatar';
import { LucideEllipsisVertical, Pencil, X } from 'lucide-react';
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
  const [isDisable, setIsDisable] = useState<boolean>(false)

  if (userContextData?.user == null || userContextData.maxExp == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
    const newUser = {
      username: username || user.username,
      name: name || user.name,
    };
    if (imageFile == null) {
      console.log("there is no file")
      const res = await UpdateUserProfile(newUser, undefined)
      if (res == 400) toast.error("something went wrong!", { icon: '😔' })
      else toast.success("updated successfully", { icon: '☺️' })
      setIsDisable(false);
      setIsEditing(false)
      return;
    };

    const bytes = await imageFile?.arrayBuffer();
    const buffer = Buffer.from(bytes as ArrayBuffer)
    const filedata = buffer.toString("base64");

    const fileObject = {
      fileName: imageFile.name,
      fileType: imageFile.type,
      fileData: filedata
    }

    const url = await UpdateUserProfile(newUser, fileObject);
    console.log(url)
    if (url == 400) {
      toast.error("failed to upload image")
    }
    else toast.success("updated successfully", { icon: '☺️' })

    const updatedUser = {
      name: newUser.name,
      username: newUser.username,
      rank: user.rank,
      level: user.level,
      exp: user.exp,
      email: user.email,
      avatar: url as string
    }

    setUser(updatedUser)
    setPreviewUrl(url as string)
    setIsDisable(false)
    setIsEditing(false);


  };

  return (
    <div className="flex justify-center items-center w-full mt-20">
      <Toaster />
      <Card className="w-full max-w-2xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl border-0">
        <CardContent>
          <div className="relative flex justify-center mb-12">
            <ExpProgress currentExp={user.exp as number} maxExp={userContextData.maxExp} size={144} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative group">
                <Avatar.Avatar className="h-28 w-28 ring-4 ring-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <Avatar.AvatarImage
                    src={previewUrl || user.avatar}
                    alt={user.username}
                    className="object-cover"
                  />
                  <Avatar.AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600">
                    {user.username?.slice(0, 2).toUpperCase() || 'UN'}
                  </Avatar.AvatarFallback>
                </Avatar.Avatar>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Pencil className="text-white" />
                  </label>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 hover:bg-blue-100/50"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
          </div>
          <div className='flex justify-center items-center mb-10' >
            <div>{user.email}</div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700">Username</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={user.username || 'Enter username'}
                  className="w-full bg-white/70 border-blue-100 focus:border-blue-200 focus:ring-blue-200"
                />
              ) : (
                <div className="p-2 bg-white/70 rounded-md border border-blue-100">
                  {user.username}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700">Name</label>
              {isEditing ? (
                <Input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={user.name || 'Enter name'}
                  className='w-full bg-white/70 border-blue-100 focus:border-blue-200 focus:ring-blue-200'
                />
              ) :
                (<div className="p-2 bg-white/70 rounded-md border border-blue-100">
                  {user.name}
                </div>)
              }
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white/70 hover:bg-blue-50"
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewUrl(null);
                    setUsername('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isDisable}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
