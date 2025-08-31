import Image from 'next/image';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image 
        src="/logo.svg" 
        alt="Interlude Logo" 
        width={24} 
        height={24}
        priority
      />
      <span className="font-bold text-lg">Interlude</span>
    </div>
  );
}
