import trainingAPI from './trainingService';

const LOCAL_FALLBACK_INSIGHTS = {
  'push': "Today's workout emphasizes upper chest and shoulders while allowing adequate recovery for your back.",
  'pull': "Today's pull session activates your lats and rhomboids. Focus on scapular retraction for maximum engagement.",
  'legs': "Leg day targets quads and glutes. Prioritize hip hinge mechanics to protect your lower back.",
  'upper': "Full upper body activation today. Balance pushing and pulling for optimal muscular balance.",
  'lower': "Lower body focus today. Activate your glutes before squatting for peak performance.",
  'full body': "Full body session - pace yourself and keep rest intervals between 60-90 seconds.",
  'work': "Full body session - pace yourself and keep rest intervals between 60-90 seconds.",
  'rest': "Rest day - focus on mobility work, hydration, and sleep for optimal recovery.",
};

export async function getWorkoutInsight({ target, recovery = 'Ready', previousTarget }) {
  try {
    const params = { target, recovery };
    if (previousTarget) {
      params.prev = previousTarget;
    }
    const response = await trainingAPI.getInsight(params);
    if (response?.data?.insight) {
      return response.data.insight;
    }
  } catch (error) {
    console.log('[insightService] Failed to fetch backend AI insight, using offline fallback:', error.message);
  }

  const key = (target || '').toLowerCase().trim();
  return LOCAL_FALLBACK_INSIGHTS[key] || `Today's ${target} workout is programmed for optimal hypertrophy and recovery balance.`;
}

export default {
  getWorkoutInsight,
};
