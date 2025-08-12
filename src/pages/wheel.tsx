import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Gift, DollarSign, Crown, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Prize {
  id: number;
  name: string;
  icon: React.ComponentType<any>;
  color: string; // HEX color for precise rendering
  probability: number;
}

const prizes: Prize[] = [
  { id: 1, name: "$5.00", icon: DollarSign, color: "#10B981", probability: 0.3 },
  { id: 2, name: "$10.00", icon: DollarSign, color: "#16A34A", probability: 0.2 },
  { id: 3, name: "$25.00", icon: DollarSign, color: "#0D9488", probability: 0.1 },
  { id: 4, name: "2x Premium", icon: Crown, color: "#F59E0B", probability: 0.15 },
  { id: 5, name: "3x Premium", icon: Crown, color: "#F97316", probability: 0.1 },
  { id: 6, name: "$50.00", icon: DollarSign, color: "#2563EB", probability: 0.05 },
];

export default function Wheel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAppState();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [labelRadius, setLabelRadius] = useState<number>(0);

  // Measure wheel size to position labels precisely inside slices
  useEffect(() => {
    const updateRadius = () => {
      if (!wheelRef.current) return;
      const rect = wheelRef.current.getBoundingClientRect();
      const radius = Math.min(rect.width, rect.height) / 2;
      setLabelRadius(radius * 0.68);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const handleBack = () => {
    setLocation("/main");
  };

  const spinWheel = () => {
    if (isSpinning || showResult) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedPrize(null);

    // Sorteio baseado na probabilidade
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedPrizeIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      cumulativeProbability += prizes[i].probability;
      if (random <= cumulativeProbability) {
        selectedPrizeIndex = i;
        break;
      }
    }

    const prizeAngle = 360 / prizes.length;
    const targetAngle = selectedPrizeIndex * prizeAngle;
    const extraSpins = 5; 
    const finalRotation = rotation + (extraSpins * 360) + (360 - targetAngle - prizeAngle / 2);

    setRotation(finalRotation);
    setSelectedPrize(prizes[selectedPrizeIndex]);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
      toast({
        title: "Congratulations!",
        description: `You won: ${prizes[selectedPrizeIndex].name}`,
      });
      // Auto reset wheel position only (keep result visible and prize stored)
      setTimeout(() => {
        setRotation(0);
      }, 2000);
    }, 3000);
  };

  const resetWheel = () => {
    setRotation(0);
    setSelectedPrize(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Wheel</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Your Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  ${ (Number(user?.balance ?? 0)).toFixed(2) }
                </p>
              </div>
                <Badge variant={user?.isPremiumReviewer ? "default" : "secondary"}>
                  {user?.isPremiumReviewer ? "Premium" : "Free"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Wheel */}
        <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">Spin the Wheel</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="relative w-80 h-80">
                {/* Wheel (equal slices via conic-gradient) */}
                <div
                  className="w-full h-full rounded-full border-4 border-gray-300 relative overflow-hidden transition-transform duration-3000 ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    backgroundImage: `conic-gradient(
                      ${prizes[0].color} 0deg 60deg,
                      ${prizes[1].color} 60deg 120deg,
                      ${prizes[2].color} 120deg 180deg,
                      ${prizes[3].color} 180deg 240deg,
                      ${prizes[4].color} 240deg 300deg,
                      ${prizes[5].color} 300deg 360deg
                    )`
                  }}
                  ref={wheelRef}
                >
                  {/* Labels */}
                  {prizes.map((prize, index) => {
                    const Icon = prize.icon;
                    const sliceAngle = 360 / prizes.length; // 60
                    const midAngle = index * sliceAngle + sliceAngle / 2; // middle of slice

                    return (
                      <div
                        key={prize.id}
                        className="absolute top-1/2 left-1/2"
                        style={{
                          transform: `rotate(${midAngle}deg) translate(0, -${labelRadius}px) rotate(-${midAngle}deg)`,
                          transformOrigin: "0 0",
                        }}
                      >
                        <div className="w-24 -translate-x-1/2 -translate-y-1/2 text-center text-white drop-shadow-md select-none">
                          <Icon className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-sm font-semibold leading-tight">{prize.name}</div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg"></div>
                </div>

                {/* Pointer (downward) */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[32px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-md"></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || showResult}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  size="lg"
                >
                  <RotateCcw className={`h-5 w-5 mr-2 ${isSpinning ? "animate-spin" : ""}`} />
                  {isSpinning ? "Spinning..." : "Spin"}
                </Button>
                <Button onClick={resetWheel} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {showResult && selectedPrize && (
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-center text-yellow-800">
                🎉 Congratulations! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-800 mb-4">You won:</div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`p-4 rounded-full ${selectedPrize.color} text-white`}>
                    <selectedPrize.icon className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-800">{selectedPrize.name}</div>
                </div>
                <Button
                  onClick={() => {
                    setShowResult(false);
                    setSelectedPrize(null);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prize List */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                <span>Available Prizes</span>
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {prizes.map((prize) => {
                const Icon = prize.icon;
                return (
                  <div
                    key={prize.id}
                    className="p-4 rounded-lg text-white text-center"
                    style={{ backgroundColor: prize.color }}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-bold">{prize.name}</div>
                    <div className="text-xs opacity-80">
                      {(prize.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
