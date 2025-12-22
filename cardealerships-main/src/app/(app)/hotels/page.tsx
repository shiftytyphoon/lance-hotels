"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Types
export interface Hotel {
  id: string;
  name: string;
  location: string;
  image_url: string | null;
  room_count: number;
  rating: number;
  status: "active" | "inactive" | "maintenance";
  created_at: string;
}

async function fetchHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const statusColors = {
    active: "bg-emerald-500/20 text-emerald-400",
    inactive: "bg-red-500/20 text-red-400",
    maintenance: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {hotel.image_url ? (
          <img
            src={hotel.image_url}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.04] flex items-center justify-center">
            <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[hotel.status]}`}>
          {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-medium text-lg mb-1">{hotel.name}</h3>
        <p className="text-white/40 text-sm flex items-center gap-1.5 mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.location}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-white/60 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {hotel.room_count} rooms
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {hotel.rating}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHotels() {
      try {
        setIsLoading(true);
        const data = await fetchHotels();
        setHotels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hotels");
      } finally {
        setIsLoading(false);
      }
    }
    loadHotels();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hotels</h1>
          <p className="text-white/40 text-sm mt-1">Manage your hotel properties.</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Hotel
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1e1e1e] rounded-xl border border-white/[0.06] overflow-hidden animate-pulse">
              <div className="h-48 bg-white/[0.04]" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-white/[0.04] rounded w-3/4" />
                <div className="h-4 bg-white/[0.04] rounded w-1/2" />
                <div className="h-px bg-white/[0.06]" />
                <div className="h-4 bg-white/[0.04] rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Hotels grid */}
      {!isLoading && !error && (
        <>
          {hotels.length === 0 ? (
            <div className="bg-[#1e1e1e] rounded-xl p-8 border border-white/[0.06] text-center">
              <svg className="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-white/60 mb-4">No hotels found. Add your first hotel to get started.</p>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                Add Hotel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
