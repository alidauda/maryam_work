"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getRecommendations,
  getUserPreferences,
  updateUserPreferences,
} from "@/app/getRecroomate";

export default function RecommendationsPage({ user }) {
  const [preferences, setPreferences] = useState({
    sleepSchedule: "",
    course: "",
    genderPreference: "",
  });

  const { data: userPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ["userPreferences", user.id],
    queryFn: () => getUserPreferences(user.id),
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useQuery({
      queryKey: ["recommendations", user.id],
      queryFn: () => getRecommendations(user.id),
      enabled: !!userPreferences, // Only run this query if we have user preferences
    });

  useEffect(() => {
    if (userPreferences) {
      setPreferences(userPreferences);
    }
  }, [userPreferences]);

  const handlePreferenceChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserPreferences(user.id, preferences);
    // Invalidate and refetch recommendations
    // queryClient.invalidateQueries(["recommendations", user.id]);
  };

  if (isLoadingPreferences) return <div>Loading preferences...</div>;

  return (
    <div>
      <h1>Roommate Preferences</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Sleep Schedule:
          <input
            type="text"
            name="sleepSchedule"
            value={preferences.sleepSchedule}
            onChange={handlePreferenceChange}
          />
        </label>
        <label>
          Course:
          <input
            type="text"
            name="course"
            value={preferences.course}
            onChange={handlePreferenceChange}
          />
        </label>
        <label>
          Gender Preference:
          <select
            name="genderPreference"
            value={preferences.genderPreference}
            onChange={handlePreferenceChange}
          >
            <option value="">No preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <button type="submit">Update Preferences</button>
      </form>

      <h2>Recommended Roommates</h2>
      {isLoadingRecommendations ? (
        <div>Loading recommendations...</div>
      ) : (
        <ul>
          {recommendations.map((recommendation) => (
            <li key={recommendation.id}>
              {recommendation.name} - Compatibility:{" "}
              {recommendation.compatibilityScore}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
