"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { LoadingScreen } from "@/components/game-ui/LoadingScreen";
import { MainMenu } from "@/components/game-ui/MainMenu";
import { GameNav } from "@/components/game-ui/GameNav";
import { PageTransition } from "@/components/game-ui/PageTransition";

export default function Home() {
  const { gamePhase } = useGame();

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-void select-none">
      <PageTransition>
        {gamePhase === "loading" ? <LoadingScreen /> : <MainMenu />}
      </PageTransition>
      <GameNav />
    </main>
  );
}
