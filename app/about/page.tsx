import { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "About | behind the TechZ",
  description: "About Rahat Hossain Himel, Software Developer and student.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        About Me
      </h1>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Rahat Hossain Himel</h2>
            <p className="text-muted-foreground text-lg">
              Software Developer & CSE Student
            </p>
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Green University of Bangladesh</span>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert">
            <p>
              Hello! I'm Himel. I'm a passionate software developer currently
              pursuing my CSE degree. My primary focus is on mobile application
              development using <strong>Kotlin</strong> and{" "}
              <strong>Compose Multiplatform (CMP)</strong>, but I also enjoy
              working across the full stack.
            </p>
            <p>
              I love building seamless, high-performance applications and am
              always eager to learn new technologies and solve complex problems
              on LeetCode.
            </p>
            <p>
              Beyond coding, I have a deep appreciation for storytelling and
              literature. You can often find me watching Anime (One Piece,
              Naruto, Demon Slayer), reading Bengali poetry, exploring the
              philosophical works of Franz Kafka, or enjoying Urdu Shayari.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-semibold uppercase tracking-wider text-muted-foreground text-sm">
              Tech Stack & Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Kotlin",
                "Compose Multiplatform",
                "Next.js",
                "NestJS",
                "Docker",
                "Prisma",
                "Java",
                "Python",
                "C++",
              ].map((skill) => (
                <span
                  key={skill}
                  className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm select-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-semibold uppercase tracking-wider text-muted-foreground text-sm">
              Connect
            </h3>
            <div className="flex gap-4">
              <Link
                href="https://github.com/himel8776"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://linkedin.com/in/rahathossainhimel"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href="mailto:himel@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
