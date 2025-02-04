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
import { motion } from 'motion/react';

const Dashboard = () => {
  const trackData = useContext(TracksContext);
  const [activeTab, setActiveTab] = useState("in-progress");

  if (!trackData?.tracks) {
    return <LoadingBall text='Loading your tracks...' />;
  }

  const inProgressTracks = trackData.tracks.filter(track => !track.completed);
  const completedTracks = trackData.tracks.filter(track => track.completed);

  return (
    <div className="min-h-screen md:pl-14 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Navbar />
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <Tabs
          defaultValue="in-progress"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <motion.div
              className="bg-white p-2 rounded-lg shadow-md"
              whileHover={{ y: -2 }}
            >
              <TabsList className="grid grid-cols-2 w-full max-w-[400px]">
                <TabsTrigger
                  value="in-progress"
                  className="flex items-center gap-2 text-sm font-medium transition-colors data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">In Progress</span>
                  <span className="sm:hidden">Progress</span>
                  <span className="ml-1">({inProgressTracks.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="flex items-center gap-2 text-sm font-medium transition-colors data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Completed ({completedTracks.length})</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>
          </div>

          <TabsContent
            value="in-progress"
            className="m-0 px-2 sm:px-0"
          >
            <InProgressTracks tracks={inProgressTracks} />
          </TabsContent>

          <TabsContent
            value="completed"
            className="m-0 px-2 sm:px-0"
          >
            <CompletedTracks tracks={completedTracks} />
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
};

export default Dashboard;
