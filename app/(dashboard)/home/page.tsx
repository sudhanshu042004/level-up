'use client'
import React from 'react';
import { useContext, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TracksContext } from '@/context/UserTracks';
import Navbar from '@/components/Navbar';
import InProgressTracks from '@/components/InProgressTrack';
import CompletedTracks from '@/components/CompletedTracks';
import { Trophy, Clock } from 'lucide-react';
import LoadingBall from '@/components/LoadingBall';

const Dashboard = () => {
  const trackData = useContext(TracksContext);
  const [activeTab, setActiveTab] = useState("in-progress");

  if (!trackData?.tracks) {
    return (
      <LoadingBall text='Loading your tracks...' />
    );
  }

  const inProgressTracks = trackData.tracks.filter(track => !track.completed);
  const completedTracks = trackData.tracks.filter(track => track.completed);

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-14 sm:pl-14 ">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <Tabs
          defaultValue="in-progress"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6 md:space-y-8">

          <div className="flex justify-center px-2 sm:px-4 ">
            <TabsList className="grid grid-cols-2 w-full max-w-[300px] sm:w-[400px]">
              <TabsTrigger
                value="in-progress"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ">

                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className='hidden sm:inline'>In Progress</span>
                <span className='sm:hidden' >Progress</span>
                <span>({inProgressTracks.length})</span>
              </TabsTrigger>

              <TabsTrigger
                value="completed"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                Completed ({completedTracks.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="in-progress"
            className="m-0 px-2 sm:px-0 ">
            <InProgressTracks tracks={inProgressTracks} />
          </TabsContent>

          <TabsContent value="completed" className="m-0 px-2 sm:px-0">
            <CompletedTracks tracks={completedTracks} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
