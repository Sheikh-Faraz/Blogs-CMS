"use client";

import { useEffect } from "react";

import TeamCard from "@/app/blocks/workspace-blocks/team-card";
import { useUser } from "@/context/User.context";

export default function TeamPage() {
  const { CurrentActiveWorkspace } = useUser();

  useEffect(() => {
    CurrentActiveWorkspace();
  }, []);

  return (
    <div className="px-4">
      <TeamCard />
    </div>
  );
}
