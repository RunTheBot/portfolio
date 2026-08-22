import fs from 'fs';
import path from 'path';

// This is a quick script to generate MDX files from the static data.
const outDir = path.join(process.cwd(), 'src/content/projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Just copy pasting the PROJECTS array to parse it easily
const PROJECTS = [
  {
    id: "frc-7520",
    title: "FRC 7520 • MineKee Robotics",
    tagline: "World Championship Robotics & Closed-Loop Control Architecture",
    year: "2021 — 2026",
    role: "Chief Engineer, Former Team Captain & Lead Programmer",
    description: "FRC 7520 is a premier competitive robotics team. As Chief Engineer, I directed the design, fabrication, and software control architecture across 8 subteams. Engineered custom Java-based control stacks using WPILib, AdvantageKit, feedforward/feedback loops, AprilTag vision localization, and multi-threaded sensor fusion.",
    heroImage: "/images/frc-hero.jpg",
    highlights: [
      "Designed and tuned PID + feedforward loops for swerve drivetrains and multi-stage elevators with zero-overshoot positioning.",
      "Implemented multi-camera AprilTag 3D pose estimation with unscented Kalman filters for sub-inch field localization.",
      "Iterated on CAD models, gear ratios, sensor placement, and custom CAN architectures for maximum thermal resilience and pit repairability.",
      "Released public CAD & codebase documentation for the global FIRST robotics community (2024, 2025, 2026 'Oasis').",
    ],
    links: [
      { label: "2026 'Oasis' Robot Reveal", url: "https://www.chiefdelphi.com/t/team-minekee-frc-7520-2026-robot-reveal-oasis/516166", type: "external" },
      { label: "2025 Offseason Build Blog", url: "https://www.chiefdelphi.com/t/team-minekee-7520-2025-offseason-build-blog/501657", type: "external" },
      { label: "2024 CAD & Code Release", url: "https://www.chiefdelphi.com/t/team-7520-minekee-2024-robot-cad-code-release/461105", type: "external" },
      { label: "GitHub Organization", url: "https://github.com/RunTheBot", type: "github" }
    ],
    techStack: [
      { category: "Software & Control", items: ["Java 17", "WPILib", "PathPlanner", "AdvantageKit", "OpenCV / PhotonVision", "Kalman Filters"] },
      { category: "Hardware & Mechanical", items: ["Kraken X60 Motors", "CANivore CAN FD", "Pigeon 2.0 IMU", "Onshape CAD", "CNC Router", "Swerve X Drive"] }
    ],
    deepDive: {
      overview: "Building a high-performance FIRST Robotics robot requires tight co-design between mechanical geometry, electrical architecture, and real-time control software. Every millisecond of actuator latency or fraction of an inch of wheel slip determines field scoring throughput.",
      technicalArchitecture: "Real-time state machine executing at 50Hz on Linux-based roboRIO with deterministic sensor acquisition loops. Telemetry is streamed over NetworkTables and logged locally using AdvantageKit structured binary formats for instant match replay analysis.",
      engineeringChallenges: [
        "Eliminating mechanical backlash in high-speed belt reduction stages while keeping total robot weight under 125 lbs.",
        "Compensating for battery voltage sag (from 12.8V down to 8.5V under peak 300A acceleration bursts) via dynamic voltage compensation in closed-loop velocity controllers.",
        "Fusing asynchronous 60fps AprilTag camera vision measurements with high-rate 250Hz wheel odometry and gyroscopic integration."
      ],
      resultsAndImpact: [
        "Achieved 2 consecutive qualifications to the FIRST Championship in Houston, TX.",
        "Published comprehensive open-source CAD models, mechanical design documents, and control repos with hundreds of community bookmarks.",
        "Mentored over 60 students in mechanical design, electrical safety, and modern Java object-oriented robotics programming."
      ]
    }
  },
  {
    id: "inverted-pendulum",
    title: "LQR Inverted Pendulum",
    tagline: "Real-Time Cart-Pole Stabilization on RP2040 Microcontroller",
    year: "2024",
    role: "Lead Hardware & Control Systems Engineer",
    description: "Engineered an inverted pendulum on a linear track from bare metal. Developed linearized state-space system dynamics, simulated closed-loop poles, and deployed a high-frequency LQR control loop on an RP2040 microcontroller with quadrature encoder feedback.",
    heroImage: "/images/mountains.jpg",
    highlights: [
      "Derived non-linear equations of motion using Lagrangian dynamics, then linearized around the unstable upright equilibrium.",
      "Computed optimal state feedback gain matrix K using continuous-time Algebraic Riccati Equation solver.",
      "Engineered dual optical rotary encoder reading on RP2040 PIO (Programmable I/O) state machines for jitter-free positioning.",
      "Capable of recovering from external impulse taps and staying continuously balanced for over 3 hours."
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/RunTheBot/Inverted-pendulum", type: "github" },
      { label: "YouTube Video Demo", url: "https://www.youtube.com/watch?v=KhN0Yt5W-70", type: "video" }
    ],
    techStack: [
      { category: "Control & Math", items: ["State-Space Linearization", "LQR Optimal Control", "MATLAB / Python SymPy", "Kalman Filtering"] },
      { category: "Embedded & Hardware", items: ["Raspberry Pi Pico (RP2040)", "C / C++ SDK", "PIO Hardware Encoders", "NEMA 17 Stepper / DC Motor", "TMC2209 Silent Driver"] }
    ],
    deepDive: {
      overview: "The inverted pendulum is the quintessential benchmark for nonlinear control theory. The objective was to build a low-cost, exceptionally stable physical benchtop system capable of autonomous balance and disturbance rejection.",
      technicalArchitecture: "State vector x = [cart position x, cart velocity x_dot, pole angle θ, pole angular velocity θ_dot]^T. Control law u = -Kx is computed every 2ms inside a dedicated RP2040 timer interrupt core, while the second core handles serial telemetry and safety cutoffs.",
      engineeringChallenges: [
        "Sensor noise and quantization effects when estimating pendulum angular velocity (dθ/dt) from discrete encoder pulses.",
        "Timing jitter in microcontrollers causing phase lag in derivative action.",
        "Backlash in the timing belt drive train causing dead-band oscillation around zero angle."
      ],
      resultsAndImpact: [
        "Proven continuous balance exceeding 3+ hours without thermal drift.",
        "Open-source hardware schematics and control firmware shared with robotics students worldwide."
      ]
    }
  },
  {
    id: "erlay-3d-printer",
    title: "erLay • Ultra-Portable CoreXY",
    tagline: "Suitcase-Packable Rapid Prototyping 3D Printer for Competition Pits",
    year: "2024",
    role: "Mechanical Designer & Firmware Integrator",
    description: "When competing at international robotics events, pit replacement parts often require custom modifications within minutes. erLay is a precision CoreXY 3D printer built with rigid linear rods, high-flow hotend, and compact quick-release frame.",
    heroImage: "/images/lake.jpg",
    highlights: [
      "Custom rod-based kinematic gantry maximizing build volume while minimizing folded volume.",
      "Klipper firmware integration with input shaping and resonance compensation for high-speed vibration-free printing.",
      "Modular quick-disconnect toolhead and umbilical wiring harness for rapid maintenance.",
      "Successfully fabricated critical robot parts on-demand in tournament pit alleys."
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/RunTheBot/erLay", type: "github" },
      { label: "YouTube Video Overview", url: "https://www.youtube.com/watch?v=6_dDa2ZOsmI", type: "video" }
    ],
    techStack: [
      { category: "Mechanical & CAD", items: ["Fusion 360 CAD", "CoreXY Belt Routing", "Linear Rail / Carbon Rods", "Custom Machined Brackets"] },
      { category: "Electronics & Firmware", items: ["Klipper Firmware", "Raspberry Pi Zero 2W", "BTT SKR Mini Board", "CAN Bus Toolhead", "Input Shaping Accelerometer"] }
    ],
    deepDive: {
      overview: "Commercial 3D printers are either too bulky to fly with or too flimsy to produce functional polycarbonate and nylon mechanical components. erLay bridges this gap as a rugged, packable manufacturing powerhouse.",
      technicalArchitecture: "Direct-drive extruder paired with a ceramic heater core, controlled via CAN bus tether to minimize wiring loom bulk. Klipper running on Pi Zero 2W provides wireless web dashboard and macro control.",
      engineeringChallenges: [
        "Maintaining belt tension and frame squareness across repeated packing, unpacking, and thermal cycles.",
        "Minimizing moving mass on the toolhead to eliminate ghosting artifacts at accelerations above 10,000 mm/s²."
      ],
      resultsAndImpact: [
        "Deployed in multiple robotics competitions, producing structural brackets and intake rollers on the spot.",
        "Showcased on YouTube and embraced by makers looking for ultra-compact mobile 3D printing solutions."
      ]
    }
  },
  {
    id: "astral-cnc",
    title: "AstralCNC • StarCNC Retrofit",
    tagline: "RP2040 / RP2350 CNC Controller with Hardware-Level EMI Safety Interlock",
    year: "2024 — 2025",
    role: "Hardware & PCB Designer",
    description: "Designed a rugged controller board interfacing an RP2040 / RP2350 with industrial stepper drivers, hardware-level emergency stop (non-software reliant to withstand severe motor EMI), 12V onboard regulator, and switchable 3.3V/5V industrial I/O supporting up to 8 stepper drivers.",
    heroImage: "/images/toronto.jpg",
    highlights: [
      "Revitalized a legacy 25-year-old Larken 24/24 router into an active aluminum and polycarbonate part cutter.",
      "Engineered hardware-level E-Stop & manual reset latching circuits that operate independently of software to prevent EMI runaway.",
      "Added 4 ADC analog inputs, PWM capability across all IO, and support for up to 8 external step/direction stepper drivers.",
      "Delivered clean step generation with grblHAL up to 200kHz per axis without missed steps."
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/RunTheBot/AstralCNC", type: "github" }
    ],
    techStack: [
      { category: "Hardware & PCB", items: ["KiCad PCB Design", "RP2350 Stamp", "AP63357 12V Buck Regulator", "74HC244 Buffers", "TXS0108E Level Shifters", "Molex KK-254"] },
      { category: "Firmware & Software", items: ["grblHAL", "RP2040 / RP2350 C SDK", "G-Code Sender", "Fusion 360 CAM Post-Processor"] }
    ],
    deepDive: {
      overview: "High schools and workshops often possess robust heavy-iron CNC router frames with obsolete parallel-port control boxes. AstralCNC converts these heavy machines into modern USB/Ethernet-ready routers.",
      technicalArchitecture: "Dual-voltage power rail architecture with transient voltage suppression (TVS diodes) and high-current PCB ground pours. Optocoupled digital inputs isolate external switches from internal 3.3V logic.",
      engineeringChallenges: [
        "Preventing electrical noise spikes from high-power router spindles from triggering false limit switch alarms.",
        "Designing hardware-level latching safety circuits that physically disconnect driver enable lines without relying on MCU GPIO pins."
      ],
      resultsAndImpact: [
        "Transformed a discarded 25-year-old shop router into an active machine cutting aluminum gussets and polycarb parts for robotics teams.",
        "Full Bill of Materials (BOM) and schematics open-sourced on GitHub."
      ]
    }
  },
  {
    id: "baylee-utra-hacks",
    title: "Baylee • Autonomous Care Robot",
    tagline: "UTRA Hacks 2025 Winner • Best Use of Generative AI",
    year: "2025",
    role: "Robotics Hardware & Systems Lead",
    description: "Built at the University of Toronto Robotics Association hackathon (UTRA Hacks 2025). Designed and fabricated an autonomous mobile robot featuring 3 motorized compartments for medicine, tissues, and sanitation, paired with facial emotion detection and conversational AI.",
    heroImage: "/images/frc-team.jpg",
    highlights: [
      "Engineered custom linear motorized slide mechanisms for automated cabinet opening and supply dispensing.",
      "Integrated Intel RealSense depth camera and OpenCV for face emotion classification (sadness, joy, stress, surprise).",
      "Connected speech-to-speech LLM backend with custom tool calling to trigger physical robot actions based on user sentiment.",
      "Constructed physical chassis with 3D-printed gears, standoffs, and interactive OLED/LCD status displays."
    ],
    links: [
      { label: "GitHub Repository", url: "https://github.com/Badbird5907/UTRA2025", type: "github" }
    ],
    techStack: [
      { category: "AI & Software", items: ["Python", "OpenCV Facial Emotion Recognition", "LLM Tool Calling API", "Speech Recognition & TTS", "Serial Communication"] },
      { category: "Hardware & Robotics", items: ["Intel RealSense Camera", "2D LiDAR Sensor", "Arduino Uno / Nano", "Raspberry Pi 4", "Gearmotors & Linear Actuators"] }
    ],
    deepDive: {
      overview: "Inspired by healthcare assistant robots, Baylee provides proactive emotional and physical care by detecting user distress and deploying physical remedies (water, tissues, first-aid, guided breathing exercises).",
      technicalArchitecture: "High-level vision pipeline feeds emotion telemetry into an agentic LLM decision loop, which emits function calls parsed into hex control commands sent over UART to the hardware driver.",
      engineeringChallenges: [
        "Integrating disparate hardware (LiDAR, RealSense, 5 motor drivers, multiple microcontrollers) within an intense 36-hour hackathon timeframe.",
        "Establishing deterministic serial packet protocol between high-level Python AI brain and low-level Arduino motor controllers."
      ],
      resultsAndImpact: [
        "Awarded 'Best Use of Generative AI' out of dozens of university robotics teams at UTRA Hacks 2025."
      ]
    }
  },
  {
    id: "differential-swerve",
    title: "Differential Swerve & Tooling",
    tagline: "Custom FRC Differential Swerve Module & Kinematics Architecture",
    year: "2024 — 2026",
    role: "Lead Mechanical & Kinematics Designer",
    description: "Designed and prototyped a high-power Differential Swerve module where two motors cooperatively drive both wheel rotation and steering azimuth via differential bevel gears, effectively doubling the usable traction torque during straight-line sprints.",
    heroImage: "/images/diff-swerve-cad.png",
    highlights: [
      "Engineered differential bevel gear transmission allowing both motors to deliver combined drive torque or differential steering azimuth.",
      "Custom bearing blocks and 3D printed structural housings designed for rapid pit swap-outs.",
      "Integrated with WPILib and Team7520 UltimateSwerveBase codebase for closed-loop field-centric heading control.",
      "Complete Bill of Materials (BOM) and Onshape parametric assembly published open-source."
    ],
    links: [
      { label: "Onshape CAD Model", url: "https://cad.onshape.com/documents/5ff0a154606e2ca4a036451a/w/bc440e39d0f320bd08dc1c12/e/1f3ddcda6d7038c73878ab2c", type: "cad" },
      { label: "GitHub Repository", url: "https://github.com/RunTheBot/UltimateSwerveBase", type: "github" }
    ],
    techStack: [
      { category: "Hardware & Mechanical", items: ["Onshape CAD", "CNC Machining", "3D Printing", "Bevel Gears", "Bearings"] },
      { category: "Software & Control", items: ["Java", "WPILib", "Differential Kinematics", "Closed-Loop Control"] }
    ],
    deepDive: {
      overview: "Standard swerve modules use one motor for driving and one for steering. Differential swerve couples both motors into a planetary-like bevel gear arrangement, ensuring both motors contribute to driving force, significantly boosting acceleration.",
      technicalArchitecture: "Mechanical differential utilizing custom-machined central bevel gears. Software kinematics decouple the left/right motor velocities into independent drive/steer vectors using a linear transformation matrix.",
      engineeringChallenges: [
        "Extreme packaging constraints to fit within standard 4x4 inch FRC module footprints.",
        "Managing gear wear and backlash in 3D printed interfaces under high shock loads."
      ],
      resultsAndImpact: [
        "Proven functional prototype that served as a CAD and mechanical design training platform for junior students."
      ]
    }
  }
];

PROJECTS.forEach(project => {
  const frontmatter = `---
title: "${project.title}"
tagline: "${project.tagline}"
year: "${project.year}"
role: "${project.role}"
heroImage: "${project.heroImage}"
links: ${JSON.stringify(project.links)}
techStack: ${JSON.stringify(project.techStack)}
---`;

  let content = `
${project.description}

### Highlights

${project.highlights.map(h => `- ${h}`).join('\n')}

### Deep Dive

${project.deepDive.overview}

#### Architecture
${project.deepDive.technicalArchitecture}

#### Challenges
${project.deepDive.engineeringChallenges.map(c => `- ${c}`).join('\n')}

#### Results
${project.deepDive.resultsAndImpact.map(r => `- ${r}`).join('\n')}
`;

  fs.writeFileSync(path.join(outDir, `${project.id}.mdx`), frontmatter + content);
});

console.log("Migration complete!");
