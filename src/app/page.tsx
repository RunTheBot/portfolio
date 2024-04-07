import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
            <p className="text-lg mt-4">
                Get started by editing <code>pages/index.js</code>
            </p>
        </div>
    </main>
  );
}
