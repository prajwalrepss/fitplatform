export interface Exercise {
  id: number;
  name: string;
  muscle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  description: string;
  restTime: string;
  intensity: string;
  tips: string[];
}

export const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Bicep Curls',
    muscle: 'Upper Body',
    difficulty: 'Intermediate',
    icon: 'fitness-outline',
    description: 'A classic isolation exercise targeting the biceps brachii. Stand with feet shoulder-width apart, grip the weights with palms facing forward, and curl upward while keeping your elbows stationary.',
    restTime: '60s',
    intensity: 'Moderate',
    tips: [
      'Keep your elbows pinned to your sides throughout the movement',
      'Control the negative (lowering) phase for maximum muscle engagement',
      'Avoid swinging or using momentum to lift the weight',
    ],
  },
  {
    id: 2,
    name: 'Squats',
    muscle: 'Lower Body',
    difficulty: 'Intermediate',
    icon: 'body-outline',
    description: 'The king of lower body exercises. Squats target your quads, hamstrings, and glutes while engaging your core for stability throughout the movement.',
    restTime: '90s',
    intensity: 'High',
    tips: [
      'Keep your chest up and core engaged throughout the movement',
      'Drive through your heels as you push back up to standing',
      'Ensure your knees track over your toes, not caving inward',
    ],
  },
  {
    id: 3,
    name: 'Shoulder Press',
    muscle: 'Upper Body',
    difficulty: 'Intermediate',
    icon: 'barbell-outline',
    description: 'An overhead pressing movement that targets the deltoids, triceps, and upper chest. Can be performed seated or standing for different stability challenges.',
    restTime: '60s',
    intensity: 'Moderate',
    tips: [
      'Press the weight directly overhead, not forward',
      'Keep your core tight to prevent lower back arching',
      'Lower the weight to ear level before pressing again',
    ],
  },
  {
    id: 4,
    name: 'Lunges',
    muscle: 'Lower Body',
    difficulty: 'Beginner',
    icon: 'walk-outline',
    description: 'A unilateral lower body exercise that improves balance and targets the quads, hamstrings, and glutes independently for each leg.',
    restTime: '45s',
    intensity: 'Low',
    tips: [
      'Take a large step forward, keeping your torso upright',
      'Lower until both knees are at 90-degree angles',
      'Push back to starting position through the front heel',
    ],
  },
  {
    id: 5,
    name: 'Lateral Raises',
    muscle: 'Upper Body',
    difficulty: 'Beginner',
    icon: 'barbell-outline',
    description: 'An isolation exercise for the lateral deltoids. Raise the weights out to your sides until arms are parallel to the floor, building wider-looking shoulders.',
    restTime: '45s',
    intensity: 'Low',
    tips: [
      'Lead with your elbows, not your hands',
      'Keep a slight bend in your elbows throughout',
      'Pause briefly at the top of the movement',
    ],
  },
  {
    id: 6,
    name: 'Knee Extensions',
    muscle: 'Lower Body',
    difficulty: 'Beginner',
    icon: 'body-outline',
    description: 'An isolation exercise for the quadriceps performed on a machine. Extend your legs fully at the knee joint against resistance for targeted quad development.',
    restTime: '45s',
    intensity: 'Low',
    tips: [
      'Extend your legs slowly and with control',
      'Squeeze your quads at full extension',
      'Avoid locking your knees at the top of the movement',
    ],
  },
];

export const recentActivities = [
  {
    id: 1,
    name: 'Bicep Curls',
    sets: 3,
    reps: 12,
    weight: '15kg',
    timestamp: 'Yesterday',
    badge: '+12% PR',
    badgeType: 'pr' as const,
    icon: 'fitness-center',
  },
  {
    id: 2,
    name: 'Weighted Squats',
    sets: 4,
    reps: 8,
    weight: '80kg',
    timestamp: '2 Days ago',
    badge: 'Completed',
    badgeType: 'completed' as const,
    icon: 'fitness-center',
  },
];

export const mockProfiles = [
  {
    id: 1,
    name: 'Ayesha',
    age: 22,
    distance: '3 km away',
    frequency: '5x/week',
    style: 'Strength',
    streak: 42,
    image: 'https://images.unsplash.com/photo-1609895518668-0e6500de4280?w=400&h=600&fit=crop',
    prompts: [
      {
        question: 'My favorite workout is...',
        answer: 'Deadlifts and anything that makes me feel unstoppable.',
      },
      {
        question: 'Looking for...',
        answer: "A spotter who won't let me ego lift but will challenge my PRs.",
      },
    ],
  },
  {
    id: 2,
    name: 'Raj',
    age: 24,
    distance: '5 km away',
    frequency: '4x/week',
    style: 'HIIT',
    streak: 28,
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=600&fit=crop',
    prompts: [
      {
        question: 'My fitness goal is...',
        answer: 'Running a sub-4 hour marathon while maintaining my strength gains.',
      },
      {
        question: 'Looking for...',
        answer: 'Someone who can keep up with my pace and push me to new limits.',
      },
    ],
  },
];

export const mockMessages = [
  { id: '1', text: 'How was your strength session today? Did you manage to increase the load?', sent: false, time: '2:30 PM' },
  { id: '2', text: 'Yeah! Pushed through for 3 sets of 5 at 225lbs. Form felt super locked in.', sent: true, time: '2:32 PM' },
  { id: '3', text: "That's huge! 225lbs for 5 is a major milestone. Any tightness in hips after?", sent: false, time: '2:35 PM' },
  { id: '4', text: 'A bit in the left hip flexor. Going to spend 15 mins on the mobility flow.', sent: true, time: '2:37 PM' },
];
