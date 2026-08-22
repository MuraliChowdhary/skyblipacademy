"use client";

import { motion } from "framer-motion";

const stages = [
  {
    label: "LEARN",
    // Placed on the inner orbit (140px diameter -> 70px radius)
    className: "left-1/2 top-[calc(50%-70px)] -translate-x-1/2 -translate-y-1/2",
  },
  {
    label: "BUILD",
    // Placed on the second orbit (200px diameter -> 100px radius)
    className: "top-1/2 left-[calc(50%+100px)] -translate-x-1/2 -translate-y-1/2",
  },
  {
    label: "EXPERIENCE",
    // Placed on the third orbit (260px diameter -> 130px radius)
    className: "left-1/2 top-[calc(50%+130px)] -translate-x-1/2 -translate-y-1/2",
  },
  {
    label: "GROW",
    // Placed on the outer orbit (320px diameter -> 160px radius)
    className: "top-1/2 left-[calc(50%-160px)] -translate-x-1/2 -translate-y-1/2",
  },
];

// Radii precisely match the height/width of the orbit rings
const movingDots = [
  {
    radius: 140,
    duration: 8,
    delay: 0,
    color: "bg-primary",
    size: "h-2 w-2",
    direction: 1,
  },
  {
    radius: 200,
    duration: 12,
    delay: 1,
    color: "bg-primary/80",
    size: "h-2 w-2",
    direction: 1, // Changed to 1 so the learning cycle flows in a uniform direction
  },
  {
    radius: 260,
    duration: 16,
    delay: 2,
    color: "bg-primary/60",
    size: "h-2.5 w-2.5",
    direction: 1,
  },
  {
    radius: 320,
    duration: 20,
    delay: 3,
    color: "bg-primary/40",
    size: "h-2 w-2",
    direction: 1,
  },
];

export function SignalOrbit() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto flex h-[380px] w-[380px] items-center justify-center"
    >
      {/* 4 Distinct Orbits matching the dot radii */}
      <div className="absolute h-[320px] w-[320px] rounded-full border border-border/40" />
      <div className="absolute h-[260px] w-[260px] rounded-full border border-border/60" />
      <div className="absolute h-[200px] w-[200px] rounded-full border border-border/80" />
      <div className="absolute h-[140px] w-[140px] rounded-full border border-border" />

      {/* Diagonal paths */}
      <div className="absolute h-px w-[320px] rotate-45 bg-border/40" />
      <div className="absolute h-px w-[320px] -rotate-45 bg-border/40" />

      {/* Stage labels */}
      {stages.map((stage, index) => (
        <motion.div
          key={stage.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.15,
          }}
          className={`absolute ${stage.className} z-20 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground shadow-sm`}
        >
          {stage.label}
        </motion.div>
      ))}

      {/* Different dots on different orbits */}
      {movingDots.map((dot, index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 top-1/2"
          style={{
            width: dot.radius,
            height: dot.radius,
            marginLeft: -dot.radius / 2,
            marginTop: -dot.radius / 2,
          }}
          initial={{
            rotate: index * 90,
          }}
          animate={{
            rotate: dot.direction === 1 ? index * 90 + 360 : index * 90 - 360,
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.span
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: index * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full ${dot.size} ${dot.color}`}
          />
        </motion.div>
      ))}

      {/* Center — learner */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-30 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-border bg-card shadow-sm"
      >
        <span className="text-[10px] font-semibold text-foreground">
          YOU
        </span>

        <motion.span
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"
        />
      </motion.div>

      {/* Status */}
      <span className="absolute -bottom-6 font-mono text-[10px] tracking-wide text-muted-foreground">
        YOUR_LEARNING_PATH · ACTIVE
      </span>
    </div>
  );
}

// cc

// const INTRO_DELAY = 900;

// export function SignalOrbit() {
//   const [visibleStages, setVisibleStages] = useState(0);
//   const [resolved, setResolved] = useState(false);

//   useEffect(() => {
//     const timers: ReturnType<typeof setTimeout>[] = [];

//     stages.forEach((_, index) => {
//       timers.push(
//         setTimeout(() => {
//           setVisibleStages(index + 1);
//         }, INTRO_DELAY * (index + 1))
//       );
//     });

//     timers.push(
//       setTimeout(() => {
//         setResolved(true);
//       }, INTRO_DELAY * (stages.length + 1))
//     );

//     return () => {
//       timers.forEach(clearTimeout);
//     };
//   }, []);

//   return (
//     <div
//       aria-hidden="true"
//       className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center sm:h-[420px] sm:w-[420px]"
//     >
//       {/* =====================================================
//           STATUS
//       ====================================================== */}

//       <div className="absolute -top-2 left-1/2 -translate-x-1/2">
//         <motion.div
//           layout
//           className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm"
//         >
//           <motion.span
//             animate={{
//               rotate: resolved ? 0 : 360,
//             }}
//             transition={{
//               duration: 1.2,
//               repeat: resolved ? 0 : Infinity,
//               ease: "linear",
//             }}
//             className="text-muted-foreground"
//           >
//             {resolved ? "✓" : "✦"}
//           </motion.span>

//           <AnimatePresence mode="wait">
//             <motion.span
//               key={resolved ? "ready" : "finding"}
//               initial={{ opacity: 0, y: 5 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -5 }}
//               transition={{ duration: 0.2 }}
//               className="font-mono text-[11px] text-muted-foreground"
//             >
//               {resolved
//                 ? "Learning path ready"
//                 : "Building your learning path..."}
//             </motion.span>
//           </AnimatePresence>
//         </motion.div>
//       </div>

//       {/* =====================================================
//           ORBITS
//       ====================================================== */}

//       <div className="absolute h-[280px] w-[280px] rounded-full border border-border/80 sm:h-[330px] sm:w-[330px]" />

//       <div className="absolute h-[190px] w-[190px] rounded-full border border-border/70 sm:h-[230px] sm:w-[230px]" />

//       {/* subtle cross paths */}
//       <div className="absolute h-px w-[280px] rotate-45 bg-border/40 sm:w-[330px]" />

//       <div className="absolute h-px w-[280px] -rotate-45 bg-border/40 sm:w-[330px]" />

//       {/* =====================================================
//           CENTRAL YOU
//       ====================================================== */}

//       <motion.div
//         animate={{
//           scale: resolved ? [1, 1.04, 1] : 1,
//         }}
//         transition={{
//           duration: 2.5,
//           repeat: resolved ? Infinity : 0,
//           ease: "easeInOut",
//         }}
//         className="relative z-30 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-border bg-card shadow-sm"
//       >
//         <span className="text-xs font-semibold text-foreground">
//           YOU
//         </span>

//         <motion.span
//           animate={{
//             scale: resolved ? [1, 1.35, 1] : 1,
//             opacity: resolved ? [0.5, 1, 0.5] : 0.7,
//           }}
//           transition={{
//             duration: 2,
//             repeat: resolved ? Infinity : 0,
//             ease: "easeInOut",
//           }}
//           className="mt-1 h-2.5 w-2.5 rounded-full bg-primary"
//         />
//       </motion.div>

//       {/* =====================================================
//           STAGES
//       ====================================================== */}

//       {stages.map((stage, index) => {
//         const isVisible = index < visibleStages;

//         /*
//          * Convert the angle into x/y coordinates.
//          *
//          * 0   = top
//          * 90  = right
//          * 180 = bottom
//          * 270 = left
//          */

//         const angleInRadians =
//           ((stage.angle - 90) * Math.PI) / 180;

//         const x = Math.cos(angleInRadians) * stage.radius;
//         const y = Math.sin(angleInRadians) * stage.radius;

//         return (
//           <AnimatePresence key={stage.id}>
//             {isVisible && (
//               <motion.div
//                 initial={{
//                   x: 0,
//                   y: 0,
//                   scale: 0.4,
//                   opacity: 0,
//                 }}
//                 animate={{
//                   x,
//                   y,
//                   scale: 1,
//                   opacity: 1,
//                 }}
//                 transition={{
//                   type: "spring",
//                   stiffness: 180,
//                   damping: 18,
//                   mass: 0.8,
//                 }}
//                 className="absolute z-20"
//               >
//                 {/* Connection dot */}
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{
//                     delay: 0.15,
//                     duration: 0.25,
//                   }}
//                   className="relative flex items-center justify-center"
//                 >
//                   {/* glow */}
//                   <motion.span
//                     initial={{ scale: 0.5, opacity: 0 }}
//                     animate={{
//                       scale: [0.8, 1.4, 0.8],
//                       opacity: [0, 0.2, 0],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "easeInOut",
//                     }}
//                     className="absolute h-10 w-10 rounded-full bg-primary"
//                   />

//                   {/* stage pill */}
//                   <motion.div
//                     animate={
//                       resolved
//                         ? {
//                             y: [0, -2, 0],
//                           }
//                         : {}
//                     }
//                     transition={{
//                       duration: 2.5,
//                       repeat: resolved ? Infinity : 0,
//                       ease: "easeInOut",
//                       delay: index * 0.15,
//                     }}
//                     className="relative rounded-full border border-border bg-background px-4 py-2 shadow-sm"
//                   >
//                     <span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground">
//                       {stage.label}
//                     </span>
//                   </motion.div>

//                   {/* small orbit dot */}
//                   <motion.span
//                     initial={{
//                       scale: 0,
//                     }}
//                     animate={{
//                       scale: 1,
//                     }}
//                     transition={{
//                       delay: 0.2,
//                       duration: 0.2,
//                     }}
//                     className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary"
//                   />
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         );
//       })}

//       {/* =====================================================
//           PROGRESS LINE
//       ====================================================== */}

//       <svg
//         className="pointer-events-none absolute inset-0 z-10 h-full w-full"
//         viewBox="0 0 360 360"
//         fill="none"
//       >
//         <motion.circle
//           cx="180"
//           cy="180"
//           r="105"
//           stroke="currentColor"
//           strokeWidth="1"
//           className="text-border"
//           initial={{
//             pathLength: 0,
//             opacity: 0,
//           }}
//           animate={{
//             pathLength: resolved ? 1 : 0.7,
//             opacity: 1,
//           }}
//           transition={{
//             duration: 1.5,
//             ease: "easeInOut",
//           }}
//         />
//       </svg>

//       {/* =====================================================
//           STATUS TEXT
//       ====================================================== */}

//       <motion.span
//         animate={{
//           opacity: resolved ? 1 : 0.6,
//         }}
//         className="absolute -bottom-10 font-mono text-[11px] tracking-wide text-muted-foreground"
//       >
//         {resolved
//           ? "LEARNING_PATH · ACTIVE"
//           : `STEP_${Math.min(visibleStages + 1, 4)} · IN_PROGRESS`}
//       </motion.span>
//     </div>
//   );
// }